import React from "react";
import { PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

interface FieldToolbarProps {
  onAddField: (
    type: "signature" | "name" | "initials" | "date" | "text",
  ) => void;
  setSelectedFile: (file: File | null) => void;
}

export function FieldToolbar({
  onAddField,
  setSelectedFile,
}: FieldToolbarProps) {
  const fields = [
    { type: "signature" as const, label: "Add Signature", primary: true },
    { type: "name" as const, label: "Add Name", primary: false },
    { type: "initials" as const, label: "Add Initials", primary: false },
    { type: "date" as const, label: "Add Date", primary: false },
    { type: "text" as const, label: "Add Text", primary: false },
  ];

  return (
    <div className="flex justify-between">
      <div className="mb-6 flex flex-wrap gap-2 sm:gap-4">
        {fields.map(({ type, label, primary }) => (
          <Button
            key={type}
            type="button"
            onClick={() => onAddField(type)}
            variant={primary ? "default" : "secondary"}
            className="flex-1 sm:flex-none"
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            <span className="whitespace-nowrap">{label}</span>
          </Button>
        ))}
      </div>
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
    </div>
  );
}
