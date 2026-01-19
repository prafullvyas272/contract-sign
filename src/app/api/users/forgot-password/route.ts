import { type NextRequest, NextResponse } from "next/server";
import pool from "@/lib/mysql";
import crypto from "crypto";
import { env } from "@/env";
import { sendMail } from "@/lib/node-mailer";

const handler = async (req: NextRequest, res: NextResponse) => {
  const { email } = await req.json();

  try {
    // Validate input
    if (!email) {
      return NextResponse.json({ message: "Email is required." });
    }

    const [rows] = await pool.query<any>("SELECT * FROM Users WHERE email = ? AND is_verified = ?", [
      email,
      true
    ]);
    let user = rows[0];
    
    if(!user) {
      return NextResponse.json({ message: "Email not exists" });  
    }

    const resetToken = crypto.randomBytes(20).toString("hex");
    const passwordResetToken = crypto.createHash("sha256").update(resetToken).digest("hex");
    const passwordResetExpires = Date.now() + 3600000;
    console.log('tet', passwordResetExpires);
    
    const [result] = await pool.query( "UPDATE Users SET reset_token  = ?, reset_token_expires = ? WHERE email = ?", [passwordResetToken, passwordResetExpires, email] );

    await sendMail(
      email,
      "Reset Password",
      `Reset Password by clicking on following url:`,
      `Reset Password by clicking on following url: <a href="${env.NEXT_PUBLIC_APP_URL}/reset-password/${passwordResetToken}">Reset your password</a>`,
    )
    return NextResponse.json({
      message: "Reset password email is sent",
      success: true,
      data: { isExistingUser: user?.isExistingUser },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
};

export { handler as POST };
