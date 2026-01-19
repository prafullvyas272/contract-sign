"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Upload,
  MoreVertical,
  Download,
  Eye,
  Trash2,
  Loader,
} from "lucide-react";
import { ROUTES } from "@/lib/constants";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import moment from "moment";
import axios from "axios";
import ConfirmationModal from "@/components/ui/confirmationModel";
import DocumentPreviewModel from "@/components/dashboard/template/DocPreviewModel";
import { toast } from "@/hooks/use-toast";
import { useSession } from "next-auth/react";

interface Template {
  id: number;
  document_name: string;
  tags: string;
  description: string;
  file_path: string;
  used_by: Date;
}
interface PreviewModel {
  isOpen: boolean;
  file_path: string;
}
interface DeleteModel {
  isOpen: boolean;
  id: number | string;
}

export default function TemplatesPage() {
  const router = useRouter();
  const session =useSession();
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [preview, setPreview] = useState<PreviewModel>({
    isOpen: false,
    file_path: "",
  });
  const [deleteModel, setDeleteModel] = useState<DeleteModel>({
    isOpen: false,
    id: "",
  });

  async function fetchTemplates() {

    try {
      setLoading(true);
      let id=session.data?.user?.id;
      if(session.data?.user?.isTeamMember){
        const adminData= await axios.get("/api/team/get-admin?id="+session.data?.user?.id);
        id=adminData.data?.admin_id;
      }
      const result = await axios.get("/api/template?id="+id);
      setTemplates(result.data || []);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }

  async function deleteTemplate(id: number | string) {
    setDeleteModel({ isOpen: false, id: "" });

    try {
      setLoading(true);
      const result = await axios.delete(`/api/template?id=${id}`);
      if (result.data) {
        setTemplates(templates.filter((template) => template.id !== id));
        toast({
          title: "Template deleted successfully",
          description: "The template has been removed.",
          variant: "default",
        });
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log(error);
    }
  }
  useEffect(() => {
    fetchTemplates();
  }, [session?.data]);
  const onClose = () => {
    setPreview({ isOpen: false, file_path: "" });
  };
  const onOpen = (file_path: string) => {
    setPreview({ isOpen: true, file_path });
  };

  const onClickUpload = (file_path: string) => {
    //ADD file_path when CORS error fixed
    const url = `${ROUTES.newContract}?file_path=${file_path}`;
    router.push(url);
  };
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Templates</h1>
          <p className="text-gray-500">Manage and track your templates</p>
        </div>
        <Button onClick={() => router.push(ROUTES.newTemplate)}>
          <Upload className="mr-2 h-4 w-4" />
          Upload Template
        </Button>
      </div>

      <div className="grid gap-4">
        {loading && <Loader className="animate-spin" />}
        {!templates?.length ? (
          <div className="flex justify-center space-y-6">
            <p className="text-gray-500">
              {loading ? "loading..." : "No Templates found."}
            </p>
          </div>
        ) : (
          templates.map((template) => (
            <Card key={template.id} className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold">{template.document_name}</h3>
                  <p className="text-sm text-gray-500">
                    {template.description}
                  </p>
                </div>
                <div className="flex items-center gap-4">
                  {/* <span className="text-sm text-gray-500">
                    {moment(template.used_by).format("DD MMM YYYY")}
                  </span> */}
                  <Eye
                    onClick={() => onOpen(template.file_path)}
                    className="h-5 w-5 text-blue-500"
                  />
                  <Upload
                    onClick={() => onClickUpload(template.file_path)}
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
                        onClick={() => {
                          const link = document.createElement("a");
                          link.href = template.file_path;
                          link.download = template.document_name;
                          link.target = "_blank";
                          document.body.appendChild(link);
                          link.click();
                          document.body.removeChild(link);
                        }}
                      >
                        <Download className="mr-2 h-4 w-4" />
                        Download
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() =>
                          setDeleteModel({ isOpen: true, id: template.id })
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
          ))
        )}
        {/* //ADD file_path when CORS error fixed */}
        <DocumentPreviewModel
          onClose={onClose}
          file_path={preview.file_path}
          open={preview.isOpen}
        />

        <ConfirmationModal
          open={deleteModel.isOpen}
          onCancel={() => setDeleteModel({ isOpen: false, id: "" })}
          onConfirm={() => {
            deleteTemplate(deleteModel.id);
          }}
          message="Are you sure you want to delete this template?"
        />
      </div>
    </div>
  );
}
