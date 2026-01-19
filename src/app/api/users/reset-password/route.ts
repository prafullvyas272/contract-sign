import { type NextRequest, NextResponse } from "next/server";
import pool from "@/lib/mysql";
import crypto from "crypto";
import { env } from "@/env";
import { sendMail } from "@/lib/node-mailer";
import bcrypt from "bcrypt";

const handler = async (req: NextRequest, res: NextResponse) => {
  const { token, password } = await req.json();

  try {
    // Validate input
    if (!token || !password) {
      return NextResponse.json({ message: "Token & Password are required." });
    }

    const [tokenRecord] = await pool.query<any>(
      "SELECT email, reset_token_expires FROM Users WHERE reset_token = ?",
      [token],
    );

    let tokenDetails = tokenRecord[0];

    if (!tokenDetails || Date.now() > tokenDetails.reset_token_expires) {
      return NextResponse.json({ message: "Invalid or expired token" });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
    const email = tokenDetails.email;

    await pool.query(
      "UPDATE Users SET reset_token = ?, reset_token_expires = ?, password = ? WHERE email = ?",
      [null, null, hashedPassword, email],
    );

    return NextResponse.json({
      message: "Password Reset Successfully",
      success: true,
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
