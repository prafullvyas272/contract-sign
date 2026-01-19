import bcrypt from "bcrypt";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

export const passwordEncypt = async (password: string): Promise<string> => {
  const salt = await bcrypt.genSalt(10);
  const passwordHash = bcrypt.hash(password, salt);
  return passwordHash;
};

// Dynamically use email credentials from environment variables (.env)
export const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: String(process.env.MAIL_SECURE).toLowerCase() === "true", // set to true for SSL/TLS, false for STARTTLS
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export const sendMail = async (
  to: string,
  subject: string,
  text: string,
  html?: string,
  attachments?: any[]
) => {
  await transporter.sendMail({
    from: process.env.MAIL_USER,
    to,
    subject,
    text,
    html,
    ...(attachments?.length ? { attachments: attachments } : {}),
  });
};

export const generateOTP = (length: number = 6): string => {
  const max = Math.pow(10, length) - 1;
  const min = Math.pow(10, length - 1);
  return Math.floor(Math.random() * (max - min + 1) + min).toString();
};
