"use client";
import { DocumentPreviewForSign } from "@/components/dashboard/contract/DocumentPreviewForSign";
import { useEffect } from "react";

export default function PreviewDocumentPage({ params }: any) {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const handleResize = () => {
        if (window.innerWidth < 768) {
          alert("Please switch to desktop mode for a better view.");
        }
      };
      handleResize(); // check at load
      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);
  return (
    <div className="flex justify-center">
      <DocumentPreviewForSign tokenProps={params} />
    </div>
  );
}
