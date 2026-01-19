"use client";

import React, { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Button } from "@/components/ui/button";
import mammoth from "mammoth";

// pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
// for legacy browsers
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

interface DocumentPreviewProps {
  fileUrl: string;
  fileType: string; // "pdf" | "docx";
  setCurrentPage: any;
  signatureUrl: any;
}

export const DocumentPreviewFromURL = React.memo(({ fileUrl, fileType, setCurrentPage, signatureUrl }: DocumentPreviewProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [scale, setScale] = useState(1);
  const [docxPages, setDocxPages] = useState<string[] | null>(null);

  const isPDF = fileType === "pdf";
  const isDOCX =
    fileType ===
    "docx" /*"application/vnd.openxmlformats-officedocument.wordprocessingml.document"*/;

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  async function handleDocxPreview() {
    try {
      const response = await fetch(fileUrl);
      const arrayBuffer = await response.arrayBuffer();
      const { value } = await mammoth.extractRawText({ arrayBuffer });

      const formattedText = value.replace(/\n/g, "<br />");
      const pages = formattedText
        .split(/(?:\n{3,}|Page Break|<page-break>|<w:br>|<w:sectPr>)/gi)
        .map((page) => page.trim());

      setDocxPages(pages);
      setNumPages(pages.length);
    } catch (error) {
      console.error("Error parsing DOCX file:", error);
    }
  }

  useEffect(() => {
    if (isDOCX) {
      handleDocxPreview();
    }
  }, [fileUrl]);

  const changePage = (type: any) => {
    setPageNumber((prev) => {
      const newPageNumber =
        type === "prev"
          ? Math.max(1, prev - 1)
          : Math.min(numPages, prev + 1);
      setCurrentPage(newPageNumber);
      
      return newPageNumber;
    });
  };

  if (isDOCX && docxPages) {
    return (
      <div className="flex flex-col items-center">
        <div className="sticky top-0 flex w-full items-center justify-between border-b bg-white p-4">
          {numPages && numPages > 1 && (
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant={"outline"}
                onClick={() => setPageNumber((prev) => Math.max(1, prev - 1))}
                disabled={pageNumber <= 1}
                className="rounded p-2 hover:bg-gray-100 disabled:opacity-50"
                title="Previous Page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                Page {pageNumber} of {numPages}
              </span>
              <Button
                type="button"
                variant={"outline"}
                onClick={() =>
                  setPageNumber((prev) => Math.min(numPages, prev + 1))
                }
                disabled={pageNumber >= numPages}
                className="rounded p-2 hover:bg-gray-100 disabled:opacity-50"
                title="Next Page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="prose mx-auto p-4">
          <div
            className="w-[80vw] border"
            dangerouslySetInnerHTML={{
              __html: docxPages[pageNumber - 1] as string,
            }}
          />
        </div>
      </div>
    );
  }

  if (isPDF) {
    return (
      <div className="flex flex-col items-center">
        <div className="sticky top-0 z-10 flex w-full items-center justify-between border-b bg-white p-4">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant={`outline`}
              onClick={() => setScale((prev) => Math.max(0.5, prev - 0.1))}
              className="rounded p-2 hover:bg-gray-100 disabled:opacity-50"
              disabled={scale <= 0.5}
              title="Zoom Out"
            >
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm font-medium">
              {Math.round(scale * 100)}%
            </span>
            <Button
              type="button"
              variant={"outline"}
              onClick={() => setScale((prev) => Math.min(2, prev + 0.1))}
              className="rounded p-2 hover:bg-gray-100 disabled:opacity-50"
              disabled={scale >= 2}
              title="Zoom In"
            >
              <ZoomIn className="h-4 w-4" />
            </Button>
          </div>

          {numPages && numPages > 1 && (
            <div className="flex items-center gap-4">
              <Button
                type="button"
                variant={"outline"}
                onClick={() => changePage("prev")}
                disabled={pageNumber <= 1}
                className="rounded p-2 hover:bg-gray-100 disabled:opacity-50"
                title="Previous Page"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              <span className="text-sm font-medium">
                Page {pageNumber} of {numPages}
              </span>
              <Button
                type="button"
                variant={"outline"}
                onClick={() =>
                  changePage("next")
                }
                disabled={pageNumber >= numPages}
                className="rounded p-2 hover:bg-gray-100 disabled:opacity-50"
                title="Next Page"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        <div className="relative w-full">
          <Document
            file={fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            className="mx-auto"
          >
            <Page
              pageNumber={pageNumber}
              scale={scale}
              renderTextLayer={false}
              renderAnnotationLayer={false}
            />
          </Document>
        </div>
      </div>
    );
  }

  return <div className="p-4 text-center">Unsupported file type</div>;
});
