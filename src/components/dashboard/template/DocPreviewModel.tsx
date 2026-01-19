import * as AlertDialog from "@radix-ui/react-alert-dialog";
import React, { useEffect } from "react";
import { DocumentPreview } from "../contract/DocumentPreview";
import { Progress } from "@/components/ui/progress";
import axios from "axios";
import { Document, Page, pdfjs } from "react-pdf";
import { DocumentPreviewFromURL } from "../contract/DocumentPreviewFromUrl";

interface DocumentPreviewModelProps {
  file_path: any;
  open: boolean;
  onClose: () => void;
  type?: string;
}

// pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.mjs`;
// for lagacy browsers
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

const DocumentPreviewModel: React.FC<DocumentPreviewModelProps> = React.memo(
  ({ file_path, open = true, onClose,type }) => {
    return (
      <AlertDialog.Root open={open}>
        <AlertDialog.Portal>
          <AlertDialog.Overlay className="fixed inset-0 bg-black bg-opacity-50" />
            <AlertDialog.Content className="fixed inset-0 flex items-center justify-center p-4">
            <AlertDialog.Title className="text-center text-lg font-semibold">
            </AlertDialog.Title>
            <AlertDialog.Cancel asChild>
              <button
              onClick={onClose}
              className="absolute right-4 top-4 text-white"
              >
              ✕
              </button>
            </AlertDialog.Cancel>
            <div className="overflow-auto max-h-full ">
              <DocumentPreviewFromURL
              fileUrl={file_path}
              fileType={type ? type : file_path.split(".").pop()}
              setCurrentPage={(v) => {}}
              />
            </div>
            </AlertDialog.Content>
        </AlertDialog.Portal>
      </AlertDialog.Root>
    );
  },
);

export default DocumentPreviewModel;
