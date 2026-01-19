"use client";

import { ContractUpload } from "@/components/dashboard/ContractUpload";
import { Suspense, useCallback, useState } from "react";

import { DocumentPreview } from "@/components/dashboard/contract/DocumentPreview";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { axiosInstance } from "@/lib/axios";
import { ROUTES } from "@/lib/constants";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { LoaderPinwheel } from "lucide-react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { convertDocxToPdf } from "@/components/dashboard/contract/converDocxPdf";

const FormSchema = z.object({
  tag: z.string().min(2, {
    message: "Tag must be at least 2 characters.",
  }),
  description: z.string().min(3, {
    message: "Description must be at least 3 characters.",
  }),
  documentName: z.string().nonempty({
    message: "Document name is required.",
  }),
  // usedByDate: z.string().nonempty({
  //   message: "Used by date is required.",
  // }),
});

export default function TemplateEditor() {
  const router = useRouter();
  const session = useSession();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [docxLoading, setDocxLoading] = useState<boolean>(false);

  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      documentName: "",
      tag: "",
      description: "",
      // usedByDate: "",
    },
  });

  async function handleFileSelect(file: File) {
    setDocxLoading(true);
    setSelectedFile(file);
    form.setValue("documentName", file.name);
    // return;
    try {
      if (file.type !== "application/pdf") {
        const conveted = await convertDocxToPdf(file);
        form.setValue("documentName", file.name?.split(".")[0] || "default");
        setSelectedFile(conveted);
      } else {
        setSelectedFile(file);
        form.setValue("documentName", file.name);
      }
    } catch (e) {
      console.log(e);
    }
    setDocxLoading(false);
  }

  const MemoisedFilePreview = useCallback(
    () => (
      <div className="flex justify-center">
        <DocumentPreview file={selectedFile as any} />
      </div>
    ),
    [selectedFile],
  );
  async function onSubmit(data: z.infer<typeof FormSchema>) {
    if (!selectedFile) {
      toast({
        title: "Please upload a document",
        description: "A document is required before submitting.",
        variant: "destructive",
      });
      return;
    }
    try {
      let id = session.data?.user?.id;
      if (session.data?.user?.isTeamMember) {
        setLoading(true);
        const adminData = await axios.get(
          "/api/team/get-admin?id=" + session.data?.user?.id,
        );
        id = adminData.data?.admin_id;
      } else setLoading(true);
      const formData = new FormData();
      formData.append("file", selectedFile);
      formData.append("tag", data.tag);
      formData.append("description", data.description);
      // formData.append("usedBy", data.usedByDate);
      formData.append("documentName", data.documentName);
      formData.append("createdBy", id as any);

      const result: any = await axiosInstance.post("/api/template", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      toast({
        title: "Template saved successfully",
        description: "Your template has been uploaded and saved.",
        variant: "default",
      });
      setLoading(false);
      setTimeout(() => {
        router.push(ROUTES.templates);
      }, 1000);
    } catch (e: any) {
      console.log(e);
      toast({
        title: "An error occurred",
        description: e.message,
        variant: "destructive",
      });
      setLoading(false);
    }
  }

  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="mx-auto px-4">
        <div className="mb-8">
          <h1 className="mb-2 text-2xl font-bold text-gray-900">
            Template Editor
          </h1>
          <p className="text-gray-600">
            Upload your document, and fill in the required details to create a
            template.
          </p>
        </div>
        {docxLoading && (
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 transform">
            <LoaderPinwheel className="animate-spin" />
          </div>
        )}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="mx-auto w-full space-y-6"
          >
            {!selectedFile ? (
              <ContractUpload onFileSelect={handleFileSelect} />
            ) : (
              <div className="space-y-7">
                <div className="mb-6 flex gap-2">
                  <Button
                    variant="secondary"
                    type="button"
                    className="flex-1 sm:flex-none"
                    onClick={() => setSelectedFile(null)}
                  >
                    Remove Document
                  </Button>
                </div>
                <MemoisedFilePreview />
              </div>
            )}
            <FormField
              control={form.control}
              name="documentName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Document Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a document name" {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide a name for the document.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tag"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tag</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a tag" {...field} />
                  </FormControl>
                  <FormDescription>
                    Add a tag to categorize your template.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter a description" {...field} />
                  </FormControl>
                  <FormDescription>
                    Provide a brief description for the template.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* <FormField
              control={form.control}
              name="usedByDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Used By Date</FormLabel>
                  <FormControl>
                    <Input type="date" placeholder="Select a date" {...field} />
                  </FormControl>
                  <FormDescription>
                    Specify the date by which this template should be used.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            /> */}
            <Button
              className="h-full w-full py-4"
              disabled={loading}
              type="submit"
            >
              {loading ? (
                <LoaderPinwheel className="animate-spin" />
              ) : (
                "Save Template"
              )}
            </Button>
          </form>
        </Form>
      </div>
    </Suspense>
  );
}
