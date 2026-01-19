import { PDFDocument } from "pdf-lib";
import * as mammoth from "mammoth";

export const previewPDF = async (file: File) => {
  let fileContent;
  const reader = new FileReader();
  reader.onload = async (event) => {
    const arrayBuffer = event.target?.result;
    if (arrayBuffer) {
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const page = pdfDoc.getPages()[0];

      // Render the first page of the PDF as an image
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      const viewport = { width: 600, height: 800 }; // Arbitrary viewport size
      canvas.width = viewport.width;
      canvas.height = viewport.height;

      // Simulate rendering (as pdf-lib does not have rendering capabilities)
      const placeholderText = document.createElement("div");
      placeholderText.textContent = "PDF Preview Rendering Not Supported Here.";
      placeholderText.style.border = "1px solid black";
      placeholderText.style.width = `${viewport.width}px`;
      placeholderText.style.height = `${viewport.height}px`;
      placeholderText.style.display = "flex";
      placeholderText.style.alignItems = "center";
      placeholderText.style.justifyContent = "center";
      placeholderText.style.backgroundColor = "#f0f0f0";

      // Clear the container and append the placeholder
      // setPreviewContent(placeholderText.outerHTML);
      fileContent = placeholderText.outerHTML;
    }
  };
  reader.readAsArrayBuffer(file);

  return fileContent;
};

export const previewDocx = async (file: File) => {
  let fileContent;
  const reader = new FileReader();
  reader.onload = async (event) => {
    const arrayBuffer: any = event.target?.result;
    if (arrayBuffer) {
      const result = await mammoth.extractRawText({ arrayBuffer });
      // setPreviewContent(result.value || "Error reading DOCX file");
      fileContent = result.value || "Error reading DOCX file";
    }
  };
  reader.readAsArrayBuffer(file);

  return fileContent;
};
