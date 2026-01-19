import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";
import { Button } from "@/components/ui/button";

// Set worker URL for pdf.js
// pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.js`;
// for lagacy browsers
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

interface DocumentPreviewProps {
  file: File;
}

export const DocumentPreview = React.memo(({ file }: DocumentPreviewProps) => {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState(1);
  const fileUrl = URL.createObjectURL(file);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }
  return (
    <div className="flex flex-col items-center">
      <Document
        file={fileUrl}
        onLoadSuccess={onDocumentLoadSuccess}
        className="rounded-lg border shadow-lg"
      >
        <Page
          pageNumber={pageNumber}
          renderTextLayer={false}
          renderAnnotationLayer={false}
          className="max-w-full"
        />
      </Document>
      {numPages && (
        <div className="mt-4 flex items-center gap-4">
          <Button
            type="button"
            variant={`outline`}
            onClick={() => setPageNumber((prev) => Math.max(prev - 1, 1))}
            disabled={pageNumber <= 1}
            className="rounded bg-gray-100 px-3 py-1 hover:bg-gray-200 disabled:opacity-50"
          >
            Previous
          </Button>
          <span className="text-sm text-gray-600">
            Page {pageNumber} of {numPages}
          </span>
          <Button
            type="button"
            variant={`outline`}
            onClick={() =>
              setPageNumber((prev) => Math.min(prev + 1, numPages))
            }
            disabled={pageNumber >= numPages}
            className="rounded bg-gray-100 px-3 py-1 hover:bg-gray-200 disabled:opacity-50"
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
});
