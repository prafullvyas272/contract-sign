import { NextResponse } from "next/server";
import { Upload } from "@aws-sdk/lib-storage";
import { s3 } from "@/lib/aws-s3";
import pool from "@/lib/mysql";
import { v4 as uuid4 } from "uuid";
import { sendMail } from "@/lib/node-mailer";
import { env } from "@/env";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import nodemailer from "nodemailer";
import { createLog } from "../log/createLog";
import moment from "moment";
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { put } from "@vercel/blob";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const title = form.get("title") as string;
    const description = form.get("description") as string;
    const userId = form.get("userId") as string;
    const userList = JSON.parse(form.get("userList") as string);
    const signatureFields = JSON.parse(form.get("signatureFields") as string);
    const tags = form.get("tags") as string;
    const contractExpiry = form.get("contractExpiry") as string;
    console.log(tags, contractExpiry);
    if (!file) {
      return NextResponse.json({
        status: "error",
        message: "No file uploaded",
      });
    }

    let uploadResult = { Location: "" };
    let fileName = `${file.name}-${Date.now()}`;
    const { url } = await put(`contract-uploads/${fileName}`, file, { access: 'public' });
    uploadResult = { Location: url };    

    const [contractData] = await pool.query<any>(
      "INSERT INTO Contracts SET ?",
      {
        title,
        description,
        file_name: file.name,
        file_path: uploadResult.Location,
        user_id: userId,
        tag: tags,
        contract_expiry: contractExpiry,
      },
    );

    const contractId = contractData.insertId;

    const placeholders = userList.map(() => "(?, ?, ?, ?, ?, ?)").join(", ");
    const query = `INSERT INTO Signatures (contract_id, user_id, user_name, user_email, token,metadata) VALUES ${placeholders}`;
    await createLog({
      log: `contract "${title}" created.`,
      createdBy: Number(userId),
      type: 1,
      contractId: contractId,
      userId: Number(userId),
    });
    const signDataPromises = userList.map(async (userData: any) => {
      const uuid = userData.id;

      await sendMail(
        userData.email,
        title || "Sign your contract",
        `${description}`,
        `<p>${description}</p><br><a href="${env.NEXT_PUBLIC_APP_URL}/contract/preview/${uuid}">Click here to view the contract</a>`,
      );
      const userSignatureField = signatureFields.filter(
        (field: any) => field.user == userData.id,
      );

      return [
        contractId,
        userId,
        userData.name,
        userData.email,
        uuid,
        JSON.stringify(userSignatureField),
      ];
    });

    const signData = await Promise.all(signDataPromises);
    await pool.query(query, signData.flat());
    createLog({
      log: `An email has been sent to ${userList.length} users to sign the contract  "${title}".`,
      createdBy: Number(userId),
      type: 1,
      contractId: contractId,
      userId: Number(userId),
    });

    //   if (!file) {
    //     return NextResponse.json({
    //       status: "error",
    //       message: "No file uploaded",
    //     });
    //   }

    //   const uploadParams = {
    //     Bucket: process.env.AWS_BUCKET_NAME!,
    //     Key: `contract-uploads/${file.name}`,
    //     Body: file.stream(),
    //     ContentType: file.type,
    //   };

    //   const upload = new Upload({
    //     client: s3,
    //     params: uploadParams,
    //   });

    //   // Await the upload completion
    //   const uploadResult = await upload.done();

    //   const [data] = await pool.query<any>("INSERT INTO Contracts SET ?", {
    //     title,
    //     description,
    //     file_name: file.name,
    //     file_path: uploadResult.Location,
    //     user_id: userId,
    //   });

    //   const placeholders = userList.map(() => "(?, ?)").join(", ");
    //   const query = `INSERT INTO Users (name, email) VALUES ${placeholders}`;
    //   const userData = userList.flatMap((user: any) => [user.name, user.email]);

    //   const [result]: any = await pool.query(query, userData);

    //   const firstInsertedId = result.insertId;
    //   const insertedIds = Array.from(
    //     { length: result.affectedRows },
    //     (_, i) => firstInsertedId + i,
    //   );

    //   const placeholders2 = insertedIds.map(() => "(?, ?, ?,?)").join(", ");
    //   const query2 = `INSERT INTO Signatures (contract_id, user_id, metadata,token) VALUES ${placeholders2}`;

    //   const signData = insertedIds.flatMap((id: any) => {
    //     const uuid = uuid4();

    //     pool
    //       .query<any>("SELECT name, email FROM Users WHERE id = ?", [id])
    //       .then((res) => {
    //         const [getUser] = res[0];
    //         console.log(getUser);
    //         sendMail(
    //           getUser.email,
    //           "Sign your contract",
    //           `${description}`,
    //           `<a href="${env.NEXT_PUBLIC_APP_URL}/contract/${uuid}">Click here to view the contract</a>`,
    //         ).then();
    //       });

    //     return [data.insertId, id, JSON.stringify(signatureFields), uuid];
    //   });

    //   const data2 = await pool.query(query2, signData);

    return NextResponse.json({
      status: "success",
      message: "File uploaded successfully",
      fileUrl: uploadResult.Location,
    });
  } catch (error: any) {
    console.error("Error uploading file:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "File upload failed",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(req: Request) {
  try {
    const { fileUrl } = await req.json();
    const fileKey = fileUrl.split("/").slice(3).join("/");

    const deleteParams = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: fileKey,
    };

    await s3.send(new DeleteObjectCommand(deleteParams));

    return NextResponse.json({
      status: "success",
      message: "File deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting file:", error);
    return NextResponse.json({
      status: "error",
      message: error.message || "File deletion failed",
    });
  }
}

export function GET(req: Request) {
  return NextResponse.json({ message: "Hello" });
}
