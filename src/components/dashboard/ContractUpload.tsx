import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, File } from "lucide-react";

interface ContractUploadProps {
  onFileSelect: (file: File) => void;
}

export function ContractUpload({ onFileSelect }: ContractUploadProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onFileSelect(acceptedFiles[0] as File);
      }
    },
    [onFileSelect],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/pdf": [".pdf"],
      "application/msword": [".doc"],
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document":
        [".docx"],
    },
    maxFiles: 1,
  });

  return (
    <div
      {...getRootProps()}
      className={`cursor-pointer rounded-lg border-2 border-dashed p-8 text-center transition-colors ${
        isDragActive
          ? "border-blue-500 bg-blue-50"
          : "border-gray-300 hover:border-blue-400"
      } `}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-4">
        {isDragActive ? (
          <Upload className="h-12 w-12 text-blue-500" />
        ) : (
          <File className="h-12 w-12 text-gray-400" />
        )}
        <div>
          <p className="text-lg font-medium text-gray-700">
            {isDragActive
              ? "Drop your document here"
              : "Drag & drop your document here"}
          </p>
          <p className="mt-1 text-sm text-gray-500">
            or click to browse (PDF, DOC, DOCX)
          </p>
        </div>
      </div>
    </div>
  );
}
