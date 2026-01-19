import pool from "@/lib/mysql";
import { generateOTP, sendMail } from "@/lib/node-mailer";
import bcrypt from "bcrypt";

export interface User {
  id: number;
  email: string;
  name: string;
  image?: string;
  role: string;
  password?: string | null;
  isExistingUser: boolean;
  isVerified: number;
}

export async function findOrCreateUser({
  email,
  name,
  role = "individual",
  password = null,
}: Partial<User>): Promise<User> {
  const [rows] = await pool.query<any>("SELECT * FROM Users WHERE email = ?", [
    email
  ]);
  let user = rows[0];

  if (user && user.is_verified) {
    user.isExistingUser = true;
    return user;
  }

  // If no user exists, create one
  const hashedPassword = password ? await bcrypt.hash(password, 10) : null;
  const otp = generateOTP();
  const expired_at = new Date(Date.now() + 10 * 60 * 1000); // 10 min

  if(user){
    const [result] = await pool.query( "UPDATE Users SET name = ?, role = ?, password = ?, otp = ?, otp_expired_at = ? WHERE email = ?", [name, role, hashedPassword, otp, expired_at, email] );
  } else {
    const [result] = await pool.query<any>(
      "INSERT INTO Users (email, name, role, password, otp, otp_expired_at) VALUES (?, ?, ?, ?, ?, ?)",
      [email, name, role, hashedPassword, otp, expired_at],
    );  
  }

  if(email){
    await sendMail(
      email,
      "Your Registration OTP",
      `Your OTP code is ${otp}. It is valid for 10 minutes.`
    );
  }

  // Retrieve the newly created user
  const [newRows] = await pool.query<any>(
    "SELECT * FROM Users WHERE email = ?",
    [email],
  );
  user = newRows[0];
  user.isExistingUser = false;

  return user;
}
