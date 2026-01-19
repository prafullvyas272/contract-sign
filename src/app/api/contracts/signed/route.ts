import pool from "@/lib/mysql";
import { sendMail } from "@/lib/node-mailer";
import { type NextRequest, NextResponse } from "next/server";
import { overlayImageOnPdf } from "../../file-upload/makepdf";
import { downloadFile } from "./down";
import { createLog } from "../../log/createLog";
import { ServerAddLogsPageToPdf } from "../../file-upload/serverAddLogs";
import axios from "axios";

const handler = async (req: NextRequest, res: NextResponse) => {
  const { fields, token, fileUrl, email, long, lat } = await req.json();
  console.log("DATAA", long, lat);

  try {
    // Validate input
    if (!token || !fields) {
      return NextResponse.json({
        message: "Token and fields are required.",
        success: false,
      });
    }
    let address = "";
    if (long && lat) {
      try {
        const response = await axios.get(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${long}`,
        );
        const data = response.data;
        const stateDistrict = data.address.state_district || "";
        const state = data.address.state || "";
        address = `${stateDistrict},${state}`.replace(/^,|,$/g, ""); // Remove leading/trailing commas
      } catch (error) {
        console.error("Error fetching address:", error);
        // Continue even if address fetch fails
      }
    }
    console.log(address);
    const [updateSignature] = await pool.query<any>(
      "UPDATE Signatures SET metadata = ?,status=?,signed_at=?,longitude=?,latitude=?,address=? WHERE token = ?",
      [
        JSON.stringify(fields),
        "signed",
        new Date(),
        long + "",
        lat + "",
        address,
        token,
      ],
    );

    const [contractIdResult] = await pool.query<any>(
      "SELECT contract_id,user_name,user_id FROM Signatures WHERE token = ?",
      [token],
    );

    const contractId =
      contractIdResult.length > 0 ? contractIdResult[0].contract_id : null;
    if (contractId)
      createLog({
        log: `Contract signed by ${contractIdResult[0].user_name} having email ${email} ${address ? `from ${address}` : ""}`,
        contractId,
        type: 2,
        signatureId: updateSignature.insertId,
        createdBy: contractIdResult[0].user_id,
      });
    const [check] = await pool.query<any>(
      `
        SELECT 
        C.*
        FROM 
        Contracts C
        WHERE 
        C.id IN (
            SELECT 
            contract_id 
            FROM 
            Signatures 
            GROUP BY 
            contract_id 
            HAVING 
            COUNT(*) = SUM(CASE WHEN status = 'signed' THEN 1 ELSE 0 END)
        )
        AND C.id = ?
        `,
      [contractId],
    );
    if (check.length === 0) {
      console.log(check);
    }
    if (check.length > 0) {
      console.log("IT HAS LENGTH", check);
      const [signatures] = await pool.query<any>(
        "SELECT S.* from Signatures as S WHERE contract_id=?",
        [check[0].id],
      );
      let signatureField: any[] = [];
      signatures.forEach((s: any) => {
        const metaData: any[] = JSON.parse(s.metadata);
        signatureField = [...signatureField, ...metaData];
      });

      createLog({
        log: `All signatures are signed for contract "${check[0].title}"`,
        contractId: check[0].id,
        type: 1,
        createdBy: check[0].user_id,
      });
      const fileData = await downloadFile(fileUrl);
      const convertedForAll: any = await overlayImageOnPdf(
        signatureField,
        fileData,
      );
      const addLogs: any = await ServerAddLogsPageToPdf(
        check[0].id,
        convertedForAll,
      );
      const res = await Promise.all(
        signatures.map(async (s: any) => {
          await sendMail(
            s.user_email,
            `Document Completed – “[${check[0].title}]” `,
            "Please find the signed contract attached to this email.",
            "Please find the signed contract attached to this email.",
            [
              {
                filename: "contract.pdf",
                content: addLogs,
              },
            ],
          );
        }),
      );
      createLog({
        log: `and email sent to all ${signatures.length} signatories for contract "${check[0].title} with signed contract"`,
        contractId: check[0].id,
        type: 1,
        createdBy: check[0].user_id,
      });
    } else {
      // const file = await downloadFile(fileUrl);
      // const converted = await overlayImageOnPdf(fields, file);
      await sendMail(
        email,
        "Contract Signed",
        "Contract Signed",
        "Contract Signed",
        // [
        //   {
        //     filename: "contract.pdf",
        //     content: converted,
        //   },
        // ],
      );
    }
    return NextResponse.json({
      success: true,
      message: "Fields updated successfully",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 },
    );
  }
};

export { handler as POST };
