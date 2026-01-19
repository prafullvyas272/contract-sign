import mammoth from "mammoth";
import { PDFDocument, rgb } from "pdf-lib";

export  async function overlayImageOnPdf(
    fields: any,
    file:File
  ) {
    try {
      // Fetch and load the existing PDF
      const isDocx=file.type ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
      let pdfBytes:any = await file.arrayBuffer();
      let pdfDoc;
      if(isDocx){
        const { value: textContent } = await mammoth.extractRawText({ arrayBuffer: pdfBytes });
  
        // Step 2: Create a new PDF document
        pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([595.28, 841.89])
        const { width, height } = page.getSize();
        const fontSize = 12;
        page.drawText(textContent, {
          x: 50,
          y: height - 50,
          size: fontSize,
          color: rgb(0, 0, 0),
          lineHeight: 18,
        });
      }else
       pdfDoc = await PDFDocument.load(pdfBytes);
      // if(isDocx){
      //   pdfBytes=await convertDocxToPdfBuffer(pdfBytes)
      // }
  
      // Get the specific page (PDF pages are 0-indexed)
      
      // Fetch and embed the image
      for (const field of fields) {
        const page = pdfDoc.getPage(field.viewPage - 1);
        const { width, height } = page.getSize();
        if (
          (field.type === "signature" || field.type === "initials") &&
          field.value
        ) {
          const base64Data = field.value.split(",")[1]; // Extract Base64 part of the data URL
          const imgBytes = Uint8Array.from(atob(base64Data), (c) =>
            c.charCodeAt(0),
          );
          const embeddedImg = await pdfDoc.embedPng(imgBytes);
          console.log("embedded", embeddedImg);
          // Get image dimensions
          const imgWidth = embeddedImg.width; // Adjust scale as needed
          const imgHeight = embeddedImg.height;
  
          // Draw the image on the page
          page.drawImage(embeddedImg, {
            x: field.position.x,
            y: height - field.position.y - 50, // Adjust for PDF's bottom-left origin
            width: 150,
            height: 50,
          });
        } else if (field.type === "name" && field.value) {
          const text = field.value;
          const fontSize = 16;
          page.drawText(text, {
            x: field.position.x + 50,
            y: height - field.position.y - 50,
            size: fontSize,
          });
        } else if (field.type === "text" && field.value) {
          const text = field.value;
          const fontSize = 16;
          page.drawText(text, {
            x: field.position.x + 50,
            y: height - field.position.y - 50,
            size: fontSize,
          });
        } else if (field.type === "date" && field.value) {
          const text = field.value;
          const fontSize = 12;
          page.drawText(text, {
            x: field.position.x,
            y: height - field.position.y - 50,
            size: fontSize,
          });
        }
      }
      // const base64Data = imgUrl.split(',')[1]; // Extract Base64 part of the data URL
      // const imgBytes = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));
      // const embeddedImg = await pdfDoc.embedPng(imgBytes);
      // console.log("embedded",embeddedImg);
      // // Get image dimensions
      // const imgWidth = embeddedImg.width / 2; // Adjust scale as needed
      // const imgHeight = embeddedImg.height / 2;
  
      // // Draw the image on the page
      // page.drawImage(embeddedImg, {
      //   x,
      //   y: height - y - imgHeight, // Adjust for PDF's bottom-left origin
      //   width: imgWidth,
      //   height: imgHeight,
      // });
      // Save the modified PDF
      const modifiedPdfBytes = await pdfDoc.save();
      console.log("tessssss", modifiedPdfBytes);
  
      // Trigger the download of the modified PDF
      // const blob = new Blob([modifiedPdfBytes], { type: "application/pdf" });
      // const link = document.createElement("a");
      // link.href = URL.createObjectURL(blob);
      // link.download = "modified.pdf";
      // link.click();
      return modifiedPdfBytes;
    } catch (error) {
      console.error("Error overlaying image on PDF:", error);
    }
  }