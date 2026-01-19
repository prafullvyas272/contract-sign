import { type NextRequest, NextResponse } from "next/server";
import pool from "@/lib/mysql";

const handler = async (req: NextRequest, res: NextResponse) => {
  const { email, otp } = await req.json();

  try {
    // Validate input
    if (!email || !otp) {
      return NextResponse.json({ message: "Email and OTP are required" });
    }

    const [result] = await pool.query<any>(
      "SELECT * FROM Users WHERE email = ? AND otp = ?",
      [email, otp],
    );

    let user = result[0];

    if (
      !user ||
      user.otp != otp ||
      new Date(result.otp_expired_at) < new Date()
    ) {
      return NextResponse.json({ message: "Invalid or expired OTP" });
    }

    await pool.query(
      "UPDATE Users SET otp = ?, otp_expired_at = ?, is_verified = ? WHERE email = ?",
      [null, null, true, email],
    );

    return NextResponse.json({
      message: "Your Account has been verified, Log in now",
      success: true,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" });
  }
};

export { handler as POST };
