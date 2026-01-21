"use client";

import { downloadFile } from "@/app/api/contracts/signed/down";
import { addLogsPageToPdf } from "@/app/api/file-upload/addLogsPdf";
import { overlayImageOnPdf } from "@/app/api/file-upload/makepdf";
import DocumentPreviewModel from "@/components/dashboard/template/DocPreviewModel";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import ConfirmationModal from "@/components/ui/confirmationModel";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { ROUTES } from "@/lib/constants";
import axios from "axios";
import {
  Download,
  Eye,
  Loader,
  MoreVertical,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import moment from "moment";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
interface DeleteModel {
  isOpen: boolean;
  id: number | string;
}
interface PreviewModel {
  isOpen: boolean;
  file_path: string;
}
interface viewContract {
  isOpen: boolean;
  contract: any;
  id: string;
}

export function Status({ status }: { status: number }) {
  let bgColor, label;
  switch (status) {
    case 1:
      bgColor = "bg-orange-400";
      label = "Partially";
      break;
    case 2:
      bgColor = "bg-green-400";
      label = "Complete";
      break;
    default:
      bgColor = "bg-red-400";
      label = "Pending";
      break;
  }
  return (
    <span className={`${bgColor} rounded px-2 py-1 text-sm text-white`}>
      {label}
    </span>
  );
}

export default function ContractsPage() {
  const router = useRouter();
  const session = useSession();
  const [contracts, setContracts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [viewContract, setViewContract] = useState<viewContract>({
    isOpen: false,
    contract: null,
    id: "",
  });
  const [deleteModel, setDeleteModel] = useState<DeleteModel>({
    isOpen: false,
    id: "",
  });
  const [preview, setPreview] = useState<PreviewModel>({
    isOpen: false,
    file_path: "",
  });

  // Fetch contracts using Axios
  useEffect(() => {
    if (!session) return;
    const fetchContracts = async () => {
      try {
        setLoading(true);
        let id = session.data?.user?.id;
        if (session.data?.user?.isTeamMember) {
          const adminData = await axios.get(
            "/api/team/get-admin?id=" + session.data?.user?.id,
          );
          id = adminData.data?.admin_id;
        }
        const response = await axios.get("/api/contracts?id=" + id);
        console.log(response.data, "RESPONES");
        setContracts(response.data);
        // Assuming the response is an array of contracts
      } catch (error) {
        console.error("Error fetching contracts:", error);
      }
      setLoading(false);
    };

    fetchContracts();
  }, [session?.data]);
  async function getModifiedpdf(contract: any) {
    setLoading(true);
    try {
      const res = await axios.get(
        "/api/contracts/signatures?id=" + contract.id,
      );
      const signatures: any[] = res.data;
      let signatureField: any[] = [];
      signatures.forEach((s) => {
        const metaData: any[] = JSON.parse(s.metadata);
        signatureField = [...signatureField, ...metaData];
      });
      if (!signatureField.length) {
        setLoading(false);
        return;
      }
      const file = await downloadFile(contract.file_path);
      const converted: any = await overlayImageOnPdf(signatureField, file);
      const addLogs: any= await addLogsPageToPdf(contract.id,converted);

      //Trigger the download of the modified PDF
      const blob = new Blob([addLogs], { type: "application/pdf" });
      setLoading(false);
      return blob;
    } catch (error) {
      console.error("Error overlaying image on PDF:", error);
    }
    setLoading(false);
    return null;
  }
  async function handleClick(contract: any) {
    setLoading(true);
    try {
      const res = await axios.get(
        "/api/contracts/signatures?id=" + contract.id,
      );
      const signatures: any[] = res.data;
      let signatureField: any[] = [];
      signatures.forEach((s) => {
        const metaData: any[] = s.metadata;    // should not be in JSON.parse as it is already a valid object
        signatureField = [...signatureField, ...metaData];
      });
      if (!signatureField.length) {
        console.log("TEST no signature fields");
        return;
      }
      const file = await downloadFile(contract.file_path);
      const converted: any = await overlayImageOnPdf(signatureField, file);
      const addLogs: any= await addLogsPageToPdf(contract.id,converted);
      //Trigger the download of the modified PDF
      const blob = new Blob([addLogs], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      setViewContract({ isOpen: true, contract: url, id: contract.id });
    } catch (error) {
      console.error("Error overlaying image on PDF:", error);
    }
    setLoading(false);
  }
  async function deleteContract(id: number | string) {
    setDeleteModel({ isOpen: false, id: "" });

    try {
      setLoading(true);
      const result = await axios.delete(`/api/contracts?id=${id}`);
      if (result.data) {
        setContracts(contracts.filter((c) => c.id !== id));
        toast({
          title: "Contract deleted successfully",
          description: "The contract has been removed.",
          variant: "default",
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  return (
    <div className="space-y-6">
      {loading && (
        <Loader className="mx-4 my-4 h-8 w-8 animate-spin justify-center text-blue-500" />
      )}
      <div className="mb-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
          <Input
            className="px-12"
            onChange={(s) => {
              setSearch(s.target.value);
            }}
            placeholder="Search contracts..."
          />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contracts</h1>
          <p className="text-gray-500">Manage and track your contracts</p>
        </div>
        <Button onClick={() => router.push(ROUTES.newContract)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Contract
        </Button>
      </div>

      <div className="grid gap-4">
        {!contracts?.length && (
          <div className="flex justify-center space-y-6">
            <p className="text-gray-500">
              {loading ? "loading..." : "No Contracts found."}
            </p>
          </div>
        )}
        {(search
          ? contracts.filter(
              (c) =>
                c?.title?.toLowerCase().includes(search.toLowerCase()) ||
                c?.tag?.toLowerCase().includes(search.toLowerCase()),
            )
          : contracts
        ).map((contract: any) => (
          <Card key={contract.id} className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="font-semibold">{contract.title}</h3>
                <p className="text-sm text-gray-500">{contract.description}</p>
                <p className="text-sm text-gray-500">Tag:{contract.tag}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm text-gray-500">
                  {contract?.contract_expiry
                    ? "EXP: " +
                      moment(contract.contract_expiry).format("DD MMM YYYY")
                    : ""}
                </span>
                <Status status={contract.status} />
                <Eye
                  onClick={() => handleClick(contract)}
                  className="h-5 w-5 text-blue-500"
                />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem
                      onClick={async () => {

                        let url = contract.file_path;

                        const link = document.createElement("a");
                        link.href = url;
                        link.target = "_blank";
                        link.download = "contract.pdf";
                        link.click();
                        link.remove();


                        // TODO: uncomment below code when s3 is integrated
                        // let url;
                        // if (
                        //   contract.id === viewContract.id &&
                        //   viewContract.contract
                        // ) {
                        //   url = viewContract.contract;
                        // } else {
                        //   const blob = await getModifiedpdf(contract);
                        //   if (!blob) {
                        //     toast({
                        //       title: "Error",
                        //       description: "Error downloading the contract",
                        //       variant: "destructive",
                        //     });
                        //     return;
                        //   }
                        //   url = URL.createObjectURL(blob);
                        // }
                        // const link = document.createElement("a");
                        // link.href = url;
                        // link.download = "contract.pdf";
                        // link.click();
                        // link.remove();
                      }}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      Download
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() =>
                        setDeleteModel({ isOpen: true, id: contract.id })
                      }
                      className="text-red-600"
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Card>
        ))}
        <DocumentPreviewModel
          onClose={() => {
            setViewContract((prev) => ({ ...prev, isOpen: false }));
          }}
          file_path={viewContract.contract}
          open={viewContract.isOpen}
          type="pdf"
        />
        <ConfirmationModal
          open={deleteModel.isOpen}
          onCancel={() => setDeleteModel({ isOpen: false, id: "" })}
          onConfirm={() => {
            deleteContract(deleteModel.id);
          }}
          message="Are you sure you want to delete this contract?"
        />
      </div>
    </div>
  );
}
