import { PDFDocument, rgb } from "pdf-lib";

export async function bindSignatureToPDF(
  file: File,
  signatureDataURL: string,
  position: { x: number; y: number },
): Promise<Blob> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const pngImage = await pdfDoc.embedPng(signatureDataURL);
  const pages = pdfDoc.getPages();
  const firstPage = pages[0];

  // Draw the signature image
  firstPage?.drawImage(pngImage, {
    x: position.x,
    y: firstPage?.getHeight() - position.y - 50, // Adjust to coordinate system
    width: 150,
    height: 50,
  });

  const pdfBytes = await pdfDoc.save();
  return new Blob([pdfBytes], { type: "application/pdf" });
}
