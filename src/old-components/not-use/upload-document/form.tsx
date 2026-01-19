"use client";

import React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import apiClient from "@/old-http/apiClient";
import { PDFDocument, rgb } from "pdf-lib";

const UploadDocumentForm = ({ signers }: { signers: any }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleFileChange = async (e: any) => {
    let file = e.target.files[0];
    if (!file) return;
    setError("");

    const maxSizeInBytes = 100 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      setError("File size must not exceed 100 MB.");
      return;
    }

    try {
      setIsUploading(true);

      if (file.type === "application/pdf") {
        const modifiedPdfBytes = await modifyPdf(file);
        const modifiedFile = new Blob([modifiedPdfBytes], {
          type: "application/pdf",
        });

        file = new File([modifiedFile], "modified-document.pdf", {
          type: "application/pdf",
        });
      }

      const formData = new FormData();
      formData.append("file", file);

      const response = await apiClient.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (response.status === 200 && response.data?.data?.location) {
        localStorage.setItem("tempFileLocation", response.data?.data?.location);
        localStorage.setItem(
          "tempFileType",
          response.data?.data?.metadata?.extension,
        );
        localStorage.removeItem("envelopeData");
        router.push(`/document-send?signers=${signers}`);
      }
      setIsUploading(false);
    } catch (error: any) {
      setError(error?.message);
    }
  };

  const modifyPdf = async (file: any) => {
    const existingPdfBytes = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(existingPdfBytes);

    const A4_WIDTH = 595.28;
    const A4_HEIGHT = 841.89;

    const newPage = pdfDoc.addPage([A4_WIDTH, A4_HEIGHT]);

    const title = "SIGNING AND EXECUTION PAGE";
    const content = [
      "This page is appended to the document titled:",
      "[[document_title]]",
      "",
      "FOR LEGALLY BINDING AND EXECUTION PURPOSES OF NAMED DOCUMENT.",
      "DATED: [[signed_by_all_at]]",
      "",
      "AND IS ENTERED INTO AND SIGNED BY ALL MENTIONED PARTIES BELOW.",
      "A TRAIL OF THIS DOCUMENT IS TO BE RETAINED FOR LEGAL PURPOSES",
      "BY ALL SIGNING PARTIES.",
    ];

    const titleFontSize = 18;
    const contentFontSize = 12;
    const blackColor = rgb(0, 0, 0);
    const whiteColor = rgb(1, 1, 1);

    const lineSpacing = 20;

    newPage.drawText(title, {
      x: (A4_WIDTH - title.length * titleFontSize * 0.56) / 2,
      y: A4_HEIGHT - 50,
      size: titleFontSize,
      color: blackColor,
    });

    let yPosition = A4_HEIGHT - 100;
    content.forEach((line) => {
      const color =
        line.includes("[[document_title]]") ||
        line.includes("[[signed_by_all_at]]")
          ? whiteColor
          : blackColor;

      newPage.drawText(line, {
        x: 50,
        y: yPosition,
        size: contentFontSize,
        color,
      });

      yPosition -= lineSpacing;
    });

    return await pdfDoc.save();
  };

  return (
    <div className="upload-document-form">
      <div className="upload-document-box position-relative">
        <i className="icon-upload" />
        <label htmlFor="files" className="form-label">
          Upload your document or drag and drop it here.
        </label>
        <input
          type="file"
          id="files"
          className="position-absolute bottom-0 end-0 start-0 top-0"
          accept=".docx, .pdf"
          onChange={handleFileChange}
        />
        {isUploading ? (
          <span className="d-block mt-2">Uploading document...</span>
        ) : (
          <>
            {error && <span className="text-danger d-block mt-2">{error}</span>}
          </>
        )}
      </div>
    </div>
  );
};

export default UploadDocumentForm;
