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
      return NextResponse.json({ message: "Token is required." });
    }

    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const [rows] = await pool.query<any>("SELECT * FROM Users WHERE reset_token = ? AND reset_token_expires > ? AND is_verified = ?", [
      token,
      Date.now(),
      true
    ]);
    let user = rows[0];
    
    if(!user) {
      return NextResponse.json({ message: "Invalid token or Expired token", success: false});  
    }

    return NextResponse.json({
      message: "Token Verified Successfully",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

export { handler as POST };
