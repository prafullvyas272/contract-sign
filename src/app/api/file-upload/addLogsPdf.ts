import { PDFDocument, StandardFonts, rgb } from "pdf-lib";
import moment from "moment";
import axios from "axios";
import { IconMap } from "./iconMaps";

interface Log {
    createdAt: string;
    log: string;
    type: number;
}

async function fetchLogsByUserId(userId: string): Promise<Log[]> {
    const response = await axios.get<Log[]>(`/api/log/contract?id=${userId}`);
    return response.data;
}

export async function addLogsPageToPdf(
    userId: any,
    existingPdfBytes: ArrayBuffer | Uint8Array,
): Promise<Uint8Array> {
    const logs = await fetchLogsByUserId(userId);
    const pdfDoc = await PDFDocument.load(existingPdfBytes);
    let page = pdfDoc.addPage([595.28, 841.89]);
    const { height, width } = page.getSize();
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);

    let cursorY = height - 50;
    page.drawText("System Logs", {
        x: 50,
        y: cursorY,
        size: 18,
        font,
        color: rgb(0, 0, 0),
    });
    cursorY -= 30;

    async function wrapText(text: string, maxWidth: number, fontSize: number, font: typeof StandardFonts.Helvetica, pdfDoc: PDFDocument): Promise<string[]> {
        const embeddedFont = await pdfDoc.embedFont(font);
        const words = text.split(" ");
        let currentLine: any = words[0];
        const lines: string[] = [];

        for (let i = 1; i < words.length; i++) {
            const word = words[i];
            const width = embeddedFont.widthOfTextAtSize(`${currentLine} ${word}`, fontSize);
            if (width < maxWidth) {
                currentLine += ` ${word}`;
            } else {
                lines.push(currentLine);
                currentLine = word;
            }
        }
        lines.push(currentLine);
        return lines;
    }

    for (const log of logs) {
        const dateString = moment(log.createdAt).format("DD MMM YYYY: hh:mm A");
        const wrappedLines:any = await wrapText(log.log, 300, 12, StandardFonts.Helvetica, pdfDoc);

        const iconBase64 = IconMap[log.type] || null;
        let iconWidth = 20;
        let textStartX = 90;
        let timelineX = 80;
        let logStartX = 220;
        let iconHeight = 16;

        if (iconBase64) {
            const base64Data: any = iconBase64.split(",")[1];
            const imgBytes = Uint8Array.from(atob(base64Data), (c) => c.charCodeAt(0));
            const embeddedIcon = await pdfDoc.embedPng(imgBytes);
            page.drawImage(embeddedIcon, {
                x: textStartX - 50,
                y: cursorY - (iconHeight - 12),
                width: iconWidth,
                height: iconHeight,
            });
        }

        page.drawText(dateString, {
            x: timelineX,
            y: cursorY,
            size: 12,
            font,
            color: rgb(0.3, 0.3, 0.3),
        });

        for (let i = 0; i < wrappedLines.length; i++) {
            page.drawText(wrappedLines[i], {
                x: logStartX,
                y: cursorY - (i * 15),
                size: 12,
                font,
                color: rgb(0, 0, 0),
            });
        }

        cursorY -= 30 + (wrappedLines.length - 1) * 15;
        if (cursorY < 50) {
            page = pdfDoc.addPage([595.28, 841.89]);
            cursorY = height - 50;
        }
    }

    return await pdfDoc.save();
}
