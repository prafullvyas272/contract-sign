import React, { useRef, useState, useEffect } from "react";
import { X, Type, Edit3 } from "lucide-react";
import { Button } from "@/components/ui/button";

interface SignaturePadProps {
  onSave: (signatureDataUrl: string) => void;
  onClose: () => void;
  isInitials?: boolean;
}

export function SignaturePad({
  onSave,
  onClose,
  isInitials = false,
}: SignaturePadProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [ctx, setCtx] = useState<CanvasRenderingContext2D | null>(null);
  const [mode, setMode] = useState<"draw" | "type">("draw");
  const [typedText, setTypedText] = useState("");
  const [selectedFont, setSelectedFont] = useState("Dancing Script");

  const fonts = [
    { name: "Dancing Script", label: "Signature Style" },
    { name: "Homemade Apple", label: "Handwritten" },
    { name: "Caveat", label: "Casual" },
  ];

  useEffect(() => {
    // Load Google Fonts
    const link = document.createElement("link");
    link.href =
      "https://fonts.googleapis.com/css2?family=Dancing+Script:wght@400;700&family=Homemade+Apple&family=Caveat:wght@400;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);

    const canvas = canvasRef.current;
    if (!canvas) return;

    const context = canvas.getContext("2d");
    if (!context) return;

    context.strokeStyle = "#000";
    context.lineWidth = isInitials ? 3 : 2;
    context.lineCap = "round";
    setCtx(context);

    return () => {
      document.head.removeChild(link);
    };
  }, [isInitials]);

  useEffect(() => {
    if (mode === "type" && ctx && typedText) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = `${isInitials ? "72px" : "48px"} "${selectedFont}"`;
      ctx.fillStyle = "#000";

      // Center the text
      const textMetrics = ctx.measureText(typedText);
      const x = (canvas.width - textMetrics.width) / 2;
      const y = canvas.height / 2;

      ctx.fillText(typedText, x, y);
    }
  }, [typedText, selectedFont, mode, isInitials]);

  const startDrawing = (e: React.MouseEvent | React.TouchEvent) => {
    if (!ctx || mode !== "draw") return;
    setIsDrawing(true);
    const { offsetX, offsetY } = getCoordinates(e);
    ctx.beginPath();
    ctx.moveTo(offsetX, offsetY);
  };

  const draw = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing || !ctx || mode !== "draw") return;
    const { offsetX, offsetY } = getCoordinates(e);
    ctx.lineTo(offsetX, offsetY);
    ctx.stroke();
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const getCoordinates = (e: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return { offsetX: 0, offsetY: 0 };

    if ("touches" in e) {
      const touch = e.touches[0];
      const rect = canvas.getBoundingClientRect();
      return {
        offsetX: touch?.clientX ?? 0 - rect.left,
        offsetY: touch?.clientY ?? 0 - rect.top,
      };
    }
    return {
      offsetX: (e as React.MouseEvent).nativeEvent.offsetX,
      offsetY: (e as React.MouseEvent).nativeEvent.offsetY,
    };
  };

  const clearCanvas = () => {
    if (!ctx || !canvasRef.current) return;
    ctx.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    setTypedText("");
  };

  const handleSave = () => {
    if (!canvasRef.current) return;
    const dataUrl = canvasRef.current.toDataURL("image/png");
    onSave(dataUrl);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="w-full max-w-lg rounded-lg bg-white p-6">
        <div className="mb-6 flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {isInitials ? "Add Your Initials" : "Create Your Signature"}
          </h3>
          <Button
            type="button"
            variant={`outline`}
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="mb-6 flex gap-4">
          <Button
            type="button"
            variant={`outline`}
            onClick={() => setMode("draw")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg border p-3 ${
              mode === "draw"
                ? "border-blue-500 bg-blue-50"
                : "hover:bg-gray-50"
            }`}
          >
            <Edit3 className="h-4 w-4" />
            Draw
          </Button>
          <Button
            type="button"
            variant={`outline`}
            onClick={() => setMode("type")}
            className={`flex flex-1 items-center justify-center gap-2 rounded-lg border p-3 ${
              mode === "type"
                ? "border-blue-500 bg-blue-50"
                : "hover:bg-gray-50"
            }`}
          >
            <Type className="h-4 w-4" />
            Type
          </Button>
        </div>

        {mode === "type" && (
          <div className="mb-4 space-y-4">
            <input
              type="text"
              value={typedText}
              onChange={(e) => setTypedText(e.target.value)}
              placeholder={
                isInitials ? "Type your initials" : "Type your signature"
              }
              className="w-full rounded-lg border p-2"
              style={{ fontFamily: selectedFont }}
            />
            <select
              value={selectedFont}
              onChange={(e) => setSelectedFont(e.target.value)}
              className="w-full rounded-lg border p-2"
            >
              {fonts.map((font) => (
                <option
                  key={font.name}
                  value={font.name}
                  style={{ fontFamily: font.name }}
                >
                  {font.label}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="mb-6 rounded-lg border bg-gray-50">
          <canvas
            ref={canvasRef}
            width={500}
            height={200}
            className={`w-full touch-none ${mode === "draw" ? "cursor-crosshair" : "cursor-default"}`}
            onMouseDown={startDrawing}
            onMouseMove={draw}
            onMouseUp={stopDrawing}
            onMouseLeave={stopDrawing}
            onTouchStart={startDrawing}
            onTouchMove={draw}
            onTouchEnd={stopDrawing}
          />
        </div>

        <div className="flex justify-between">
          <Button type="button" variant="secondary" onClick={clearCanvas}>
            Clear
          </Button>
          <Button type="button" onClick={handleSave}>
            Save {isInitials ? "Initials" : "Signature"}
          </Button>
        </div>
      </div>
    </div>
  );
}
