import type { Field } from "@/types/dashboard";
import { useRef } from "react";
import { pdfjs } from "react-pdf";
import { SignatureField } from "../SignatureField";
import { DocumentPreview } from "./DocumentPreview";
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/legacy/build/pdf.worker.min.mjs`;

interface DocumentWorkspaceProps {
  file: File;
  fields: Field[];
  onFieldPositionChange: (
    id: string,
    position: { x: number; y: number },
  ) => void;
  onFieldValueChange: (id: string, value: string) => void;
  onFieldDelete: (id: string) => void;
  setCurrentPage: any;
  currentPage: number;
}

export function DocumentWorkspace({
  file,
  fields,
  onFieldPositionChange,
  onFieldValueChange,
  onFieldDelete,
  setCurrentPage,
  currentPage,
}: DocumentWorkspaceProps) {
  const workspaceRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={workspaceRef}
      className="relative overflow-hidden rounded-lg border bg-gray-50"
    >
      <div className="relative w-full">
        <DocumentPreview file={file} setCurrentPage={setCurrentPage} />
        <div className="absolute inset-0 top-16 z-10">
          {fields.map(
            (field) =>
              currentPage === field.viewPage && (
                <SignatureField
                  key={field.id}
                  type={field.type}
                  position={field.position}
                  value={field.value}
                  onPositionChange={(position) =>
                    onFieldPositionChange(field.id, position)
                  }
                  onValueChange={(value) => onFieldValueChange(field.id, value)}
                  onDelete={() => onFieldDelete(field.id)}
                />
              ),
          )}
        </div>
      </div>
      {/* <Button
        onClick={() => {
          overlayImageOnPdf(fields, file);
        }}
      >
        TEST
      </Button> */}
    </div>
  );
}
