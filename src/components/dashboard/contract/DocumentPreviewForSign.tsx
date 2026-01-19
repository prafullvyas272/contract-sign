"use client";

import { Button } from "@/components/ui/button";
import { toast } from "@/hooks/use-toast";
import { axiosInstance } from "@/lib/axios";
import type { Field } from "@/types/dashboard";
import { LoaderPinwheel, Save } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { SignatureField } from "../SignatureField";
import { DocumentPreviewFromURL } from "./DocumentPreviewFromUrl";
import ConfirmationModal from "@/components/ui/confirmationModel";
import TermsModal from "@/components/ui/TermsModal";

export function DocumentPreviewForSign({ tokenProps }: any) {
  const router = useRouter();
  const [fields, setFields] = useState<Field[]>([]);
  const [filePath, setFilePath] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [id, setId] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [signatureUrl, setSignatureUrl] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [termsChecked, setTermsChecked] = useState(false);
  const [open, setOpen] = useState(false);
  const [success, setSuccess] = useState(false);
  const [status, setStatus] = useState("");
  const [location, setLocation] = useState<{
    lat: number | null;
    long: number | null;
  }>({
    lat: null,
    long: null,
  });
  const [locationError, setLocationError] = useState<string | null>(null);

  // Function to get user location
  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("Geolocation is not supported by your browser.");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation({
          lat: position.coords.latitude,
          long: position.coords.longitude,
        });
        setLocationError(null);
      },
      (error) => {
        console.log(error);
        toast({
          title: "Permission denied",
          description:
            "Location access is blocked. Please enable it in your browser settings.",
          variant: "destructive",
        });
        setLocationError("Permission denied. Location is required to proceed.");
      },
    );
  };

  useEffect(() => {
    getLocation(); // Request location on component mount
  }, []);

  useEffect(() => {
    const tokenVerification = async () => {
      try {
        const verifyToken: any = await axiosInstance.post(
          "/api/contracts/verify-token",
          {
            token: tokenProps.token,
          },
        );

        toast({
          title: verifyToken.message,
        });

        if (!verifyToken.success) {
          router.push("/404");
        } else {
          console.log(verifyToken);
          const { metadata, file_path, signatureStatus } = verifyToken.data;
          setFilePath(file_path);
          setFields(JSON.parse(metadata));
          setId(verifyToken.data.ID);
          setEmail(verifyToken.data.email);
          setStatus(signatureStatus);
          setIsLoading(true);
        }
      } catch (error) {
        router.push("/404");
      }
    };
    tokenVerification();
  }, [tokenProps.token]);

  const onFieldValueChange = (id: string, value: string) => {
    setFields((prev) =>
      prev.map((field) => (field.id === id ? { ...field, value } : field)),
    );
    setSignatureUrl(value);
  };

  const submitDocument = async () => {
    // Check if location is available
    if (!location.lat || !location.long) {
      toast({
        title: "Error",
        description: "Location is required to proceed.",
        variant: "destructive",
      });
      return;
    }

    // Validate fields
    for (const field of fields) {
      if (!field.value?.length) {
        toast({
          title: "Error",
          description: "Please fill all the fields",
          variant: "destructive",
        });
        return;
      }
    }

    try {
      setUploadLoading(true);
      const signedDocs: any = await axiosInstance.post(
        "/api/contracts/signed",
        {
          fields,
          token: tokenProps.token,
          id,
          fileUrl: filePath,
          email,
          lat: location.lat,
          long: location.long,
        },
      );
      toast({
        title: "Signed Successfully",
        description: "Document has been signed successfully",
        variant: "default",
      });
      setSuccess(true);
    } catch (error) {
      console.log(error);
      toast({
        title: "Error",
        description: "Error signing document",
        variant: "destructive",
      });
    } finally {
      setUploadLoading(false);
    }
  };

  return (
    <div>
      {success || status === "signed" ? (
        <div className="flex h-full w-full items-center p-12">
          <p className="text-center text-lg text-gray-800">
            {status === "signed"
              ? "Document already signed"
              : "Document signed successfully"}
          </p>
        </div>
      ) : (
        <div className="relative overflow-hidden rounded-lg border bg-gray-50">
          {isLoading && (
            <div className="relative">
              <DocumentPreviewFromURL
                fileUrl={filePath}
                fileType={filePath && filePath.split(".").pop()}
                setCurrentPage={setCurrentPage}
                signatureUrl={signatureUrl}
              />
              <div className="absolute inset-0 top-16 z-10">
                {fields.map(
                  (field) =>
                    currentPage === field.viewPage && (
                      <SignatureField
                        key={field.id}
                        type={field.type}
                        position={field.position}
                        value={field.value}
                        isDraggable={false}
                        onValueChange={(value) =>
                          onFieldValueChange(field.id, value)
                        }
                      />
                    ),
                )}
              </div>
            </div>
          )}
          <div className="p-4">
            {locationError && (
              <div className="mb-4 text-center">
                <p className="text-red-500">{locationError}</p>
                <Button className="mt-2" onClick={getLocation}>
                  Allow Location Access
                </Button>
              </div>
            )}
            <Button
              disabled={uploadLoading || !!locationError}
              className="w-full py-4"
              onClick={() => {
                !termsChecked ? setOpen(true) : submitDocument();
              }}
            >
              {uploadLoading ? (
                <LoaderPinwheel className="animate-spin" />
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4 text-white" /> Send Document
                </>
              )}
            </Button>
          </div>
          <TermsModal
            heading="Accept and Continue to Sign"
            message="I agree to use digital signatures as a legally binding form of acceptance and have read and understood the terms and conditions of using such tools as well as the laws related to e-signatures and their enforceability as per various global laws and standards."
            open={open}
            onCancel={() => {
              setOpen(false);
            }}
            onConfirm={() => {
              setTermsChecked(true);
              setOpen(false);
              submitDocument();
            }}
            confirmationBtn="Accept & Continue To Sign"
          />
        </div>
      )}
    </div>
  );
}
