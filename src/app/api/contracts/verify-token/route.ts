import { type NextRequest, NextResponse } from "next/server";
import pool from "@/lib/mysql";
import crypto from "crypto";
import { env } from "@/env";
import { sendMail } from "@/lib/node-mailer";

const handler = async (req: NextRequest, res: NextResponse) => {
  const { token } = await req.json();

  try {
    // Validate input
    if (!token) {
      return NextResponse.json({ message: "Token is required.", success: false });
    }

    const [rows] = await pool.query<any>(
      "SELECT Signatures.id  as ID,Signatures.status as signatureStatus,  Signatures.user_email as email, Contracts.file_path, Signatures.metadata FROM Signatures INNER JOIN Contracts ON Signatures.contract_id = Contracts.id WHERE Signatures.token = ?",
      [token],
    );
    let signatureFields = rows[0];
    
    if(!signatureFields) {
      return NextResponse.json({ message: "Invalid token or Expired token", success: false});  
    }

    return NextResponse.json({
      success: true,
      data: signatureFields
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

export { handler as POST };
