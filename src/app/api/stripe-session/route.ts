import { NextResponse } from "next/server";
import { Upload } from "@aws-sdk/lib-storage";
import { s3 } from "@/lib/aws-s3";
import pool from "@/lib/mysql";
import { retrieveStripeSession } from "../wallet/createWalletSession";
import { sendMail } from "@/lib/node-mailer";
import { env } from "@/env";
import { json } from "stream/consumers";
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { put } from "@vercel/blob";

export async function POST(req: Request) {
  try {
    // Parse form data
    const form = await req.formData();
    const file = form.get("file") as File | null;
    const title = form.get("title") as string | null;
    const description = form.get("description") as string | null;
    const users = form.get("users") as string | null;
    const userList = form.get("userList") as string | null;
    const signatureFields = form.get("signatureFields") as string | null;
    const userId = form.get("userId") as string | null;
    const sessionId = form.get("sessionId") as string | null;
    const walletAmount = form.get("walletAmount") as string | null;
    const tags = form.get("tags") as string | null;

    // Validate required fields
    if (!file || !title || !description || !userId || !sessionId) {
      return NextResponse.json({
        status: "error",
        message: "Missing required fields",
      });
    }

    let uploadResponse = { Location: "" };
    let fileName = `${Date.now()}-${file.name}`;
    const { url } = await put(`contract-uploads/${fileName}`, file, { access: 'public' });
    uploadResponse = { Location: url };    

    const [data] = await pool.query<any>("INSERT INTO session_data SET ?", {
      session_id: sessionId,
      file_url: uploadResponse.Location,
      title,
      description,
      users: users ? JSON.stringify(JSON.parse(users)) : null,
      user_list: userList ? JSON.stringify(JSON.parse(userList)) : null,
      signature_fields: signatureFields
        ? JSON.stringify(JSON.parse(signatureFields))
        : null,

      user_id: userId,
      wallet_amount: walletAmount ? parseInt(walletAmount) : 0,
      tags,
    });

    return NextResponse.json({
      status: "success",
      message: "Session data saved successfully",
      data: {
        sessionId,
        fileUrl: uploadResponse.Location,
        recordId: data.insertId,
      },
    });
  } catch (error: any) {
    console.error("Error saving session data:", error);
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to save session data",
        error: error.message,
      },
      { status: 500 },
    );
  }
}

export async function getStripeData(sessionId: string) {
  try {
    if (!sessionId) throw new Error("Missing sessionId parameter");

    const [rows] = await pool.query<any>(
      "SELECT * FROM session_data WHERE session_id = ?",
      [sessionId],
    );

    if (rows.length === 0)
      throw new Error("No data found for the given sessionId");

    return rows[0];
  } catch (error: any) {
    console.error("Error retrieving session data:", error.message);
    throw error;
  }
}
interface BodyParams {
  paymentStatus: string;
  StripeSession: string;
}
export async function PUT(req: Request) {
  try {
    // Parse request body
    const data: BodyParams = await req.json();

    // Retrieve Stripe session data
    const stripeSession = await retrieveStripeSession(data.StripeSession);
    const stripeMetaData = await getStripeData(data.StripeSession);

    if (!stripeSession.isSuccess) {
      return NextResponse.json({
        status: "error",
        message: "Failed to retrieve Stripe session",
      });
    }

    const {
      file_url: fileUrl,
      title,
      description,
      user_list,
      signature_fields,
      user_id: userId,
      wallet_amount: walletAmount,
      tags,
    } = stripeMetaData;
    // const userList = JSON.parse(user_list);
    // const signatureFields = JSON.parse(signature_fields);

    const userList = user_list;
    const signatureFields = signature_fields;
    if (
      !title ||
      !description ||
      !userId ||
      !userList ||
      !signatureFields ||
      !fileUrl
    ) {
      return NextResponse.json({
        status: "error",
        message: "Missing required metadata from Stripe session",
      });
    }
    console.log();
    // Insert contract data into the Contracts table
    const [contractData] = await pool.query<any>(
      "INSERT INTO Contracts SET ?",
      {
        title,
        description,
        file_name: fileUrl.split("/").pop(),
        file_path: fileUrl,
        user_id: userId,
        tag: tags || "",
      },
    );

    const contractId = contractData.insertId;
    if (walletAmount) {
      const [deduct] = await pool.query(
        "UPDATE Users SET wallet=wallet-? WHERE id=?",
        [walletAmount, userId],
      );
    }
    // Prepare data for the Signatures table
    const placeholders = userList.map(() => "(?, ?, ?, ?, ?, ?)").join(", ");
    const query = `INSERT INTO Signatures (contract_id, user_id, user_name, user_email, token, metadata) VALUES ${placeholders}`;

    const signDataPromises = userList.map(async (userData: any) => {
      const uuid = userData.id;

      // Send an email to the user
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

    // Insert signatures data into the Signatures table
    await pool.query(query, signData.flat());

    return NextResponse.json({
      status: "success",
      message: "Contract and signatures data saved successfully",
      contractId,
    });
  } catch (error: any) {
    console.error("Error processing Stripe session data:", error);
    return NextResponse.json(
      {
        status: "error",
        message: error.message || "Failed to process Stripe session data",
      },
      { status: 500 },
    );
  }
}
