import mammoth from "mammoth";
import { PDFDocument } from "pdf-lib";
import html2canvas from "html2canvas";


export async function convertDocxToPdf(file: File): Promise<File> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const { value }: { value: string } = await mammoth.convertToHtml({ arrayBuffer });

    const charsPerPage = 3000; // Approximation for page content
    const pages: string[] = [];
    let currentPage = "";

    value.split(" ").forEach((word) => {
      if ((currentPage.length + word.length) > charsPerPage) {
        pages.push(currentPage);
        currentPage = word + " ";
      } else {
        currentPage += word + " ";
      }
    });

    if (currentPage) {
      pages.push(currentPage);
    }

    const pdfBytes = await generatePdfFromDocx(pages);

    const pdfFile = new File([pdfBytes], `${file.name.replace(/\.docx$/, "")}.pdf`, {
      type: "application/pdf",
    });

    return pdfFile;
  } catch (error) {
    console.error("Error converting DOCX to PDF:", error);
    throw error;
  }
}


async function generatePdfFromDocx(docxPages: string[]): Promise<Uint8Array> {
  const pdfDoc = await PDFDocument.create();

  for (const htmlContent of docxPages) {
    const container = document.createElement("div");
    container.style.width = "595px"; // A4 width in points
    container.style.padding = "20px";
    container.style.paddingBottom="120px"
    container.style.boxSizing = "border-box";
    container.innerHTML = htmlContent;

    document.body.appendChild(container);

    const canvas = await html2canvas(container, {
      scale: 1, // Avoid scaling for pixel accuracy
    });

    document.body.removeChild(container);

    const requiredHeight = (canvas.height / canvas.width) * 595.28; //A4 size 
    const pageSize = [595.28, requiredHeight];

    const page = pdfDoc.addPage(pageSize);
    const { width, height } = page.getSize();

    const imgData = canvas.toDataURL("image/png");
    const image = await pdfDoc.embedPng(imgData);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width,
      height,
    });
  }

  const pdfBytes = await pdfDoc.save();
  return pdfBytes;
}
