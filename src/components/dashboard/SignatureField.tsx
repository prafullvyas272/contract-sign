import React, { useRef, useState } from "react";
import Draggable from "react-draggable";
import { SignaturePad } from "./contract/SignaturePad";
import { Edit2, Trash2, GripHorizontal } from "lucide-react";
import { Button } from "react-bootstrap";

interface SignatureFieldProps {
  type: "signature" | "name" | "initials" | "date" | "text" | "";
  position: { x: number; y: number };
  onPositionChange?: (position: { x: number; y: number }) => void;
  onDelete?: () => void;
  value?: string;
  onValueChange?: (value: string) => void;
  isDraggable?: boolean;
}

export function SignatureField({
  type,
  position,
  onPositionChange,
  onDelete,
  value,
  onValueChange = (val) => {},
  isDraggable = true,
}: SignatureFieldProps) {
  const [showSignaturePad, setShowSignaturePad] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const nodeRef = useRef(null);

  const handleSignatureSave = (signatureDataUrl: string) => {
    console.log(signatureDataUrl);
    onValueChange(signatureDataUrl);
    // setSignatureUrl(signatureDataUrl);
    setShowSignaturePad(false);
  };

  const handleFieldClick = () => {
    if (type === "signature" || type === "initials") {
      setShowSignaturePad(true);
    } else {
      setIsEditing(true);
      setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    }
  };

  const getPlaceholder = () => {
    switch (type) {
      case "signature":
        return "Click to sign";
      case "name":
        return "Full Name";
      case "initials":
        return "Initial here";
      case "date":
        return "Select date";
      default:
        return "";
    }
  };

  const renderFieldContent = () => {
    if (type === "signature" || type === "initials") {
      if (value) {
        return (
          <img
            src={value}
            alt={type === "signature" ? "Signature" : "Initials"}
            className="h-12 max-w-[200px] object-contain"
          />
        );
      }
    } else if (isEditing || value) {
      return (
        <input
          ref={inputRef}
          type={type === "date" ? "date" : "text"}
          value={value || ""}
          onChange={(e) => onValueChange(e.target.value)}
          onBlur={() => setIsEditing(false)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              setIsEditing(false);
            }
          }}
          className="w-full rounded border bg-white px-2 py-1"
          placeholder={getPlaceholder()}
        />
      );
    }

    return (
      <div className="min-w-[120px] rounded border-2 border-blue-300 bg-blue-50 px-4 py-2 text-center text-sm text-blue-700">
        {getPlaceholder()}
      </div>
    );
  };

  return (
    <>
      <Draggable
        nodeRef={nodeRef}
        position={position}
        onStop={(_, data) => onPositionChange({ x: data.x, y: data.y })}
        bounds="parent"
        handle=".drag-handle"
        disabled={!isDraggable}
      >
        <div ref={nodeRef} className="group absolute cursor-move">
          <div className="relative rounded-lg bg-white shadow-sm transition-shadow hover:shadow-md">
            <div className="flex items-center">
              <div
                className="drag-handle cursor-move rounded-l-lg border-r p-2 hover:bg-gray-50"
                title="Drag to move"
              >
                <GripHorizontal className="h-4 w-4 text-gray-400" />
              </div>
              <div
                className="flex-grow cursor-pointer p-2"
                onClick={handleFieldClick}
              >
                {renderFieldContent()}
              </div>
            </div>

            <div className="absolute -top-8 right-0 hidden gap-2 rounded-lg bg-white p-1 shadow group-hover:flex">
              <Button
                type="button"
                variant={`outline`}
                onClick={(e) => {
                  e.stopPropagation();
                  handleFieldClick();
                }}
                className="rounded p-1.5 hover:bg-gray-100"
                title="Edit"
              >
                <Edit2 className="h-4 w-4 text-gray-600" />
              </Button>
              {isDraggable && (
                <Button
                  type="button"
                  variant={`outline`}
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete();
                  }}
                  className="rounded p-1.5 hover:bg-gray-100"
                  title="Delete"
                >
                  <Trash2 className="h-4 w-4 text-red-600" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </Draggable>

      {showSignaturePad && (type === "signature" || type === "initials") && (
        <SignaturePad
          onSave={handleSignatureSave}
          onClose={() => setShowSignaturePad(false)}
          isInitials={type === "initials"}
        />
      )}
    </>
  );
}
