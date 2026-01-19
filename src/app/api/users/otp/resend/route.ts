import { type NextRequest, NextResponse } from "next/server";
import pool from "@/lib/mysql";
import { generateOTP, sendMail } from "@/lib/node-mailer";

const handler = async (req: NextRequest, res: NextResponse) => {
  const { email } = await req.json();

  try {
    // Validate input
    if (!email) {
      return NextResponse.json({ message: "Email is required" });
    }

    const [rows] = await pool.query<any>("SELECT * FROM Users WHERE email = ?", [
      email
    ]);
    let user = rows[0];

    const otp = generateOTP();
    const expired_at = new Date(Date.now() + 10 * 60 * 1000); // 10 min

    if(email){
      await pool.query( "UPDATE Users SET otp = ?, otp_expired_at = ? WHERE email = ?", [otp, expired_at, email] );
      
      await sendMail(
        email,
        "Your Registration OTP",
        `Your OTP code is ${otp}. It is valid for 10 minutes.`
      );
    }
    
    return NextResponse.json({
      message: "Otp has been send to your email",
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ message: "Internal Server Error" });
  }
};

export { handler as POST };
