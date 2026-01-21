import { s3 } from "@/lib/aws-s3";
import pool from "@/lib/mysql";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";
import { put } from "@vercel/blob";

export async function POST(req: Request) {
  const form = await req.formData();
  const file = form.get("file") as File | null;
  const document_name = form.get("documentName") as string | null;
  const tag = form.get("tag") as string;
  const description = form.get("description") as string;
  // const usedBy = form.get("usedBy") as string;
  const createdBy = form.get("createdBy") as string;

  if (!file) {
    return NextResponse.json({
      status: "error",
      message: "No file uploaded",
    });
  }
  if (!tag || !description ) {
    return NextResponse.json({
      status: "error",
      message: "Please fill all required the fields",
    });
  }

  let uploadResponse = { Location: "" };
  let fileName = `${Date.now()}-${file.name}`;
  const { url } = await put(`templates/${fileName}`, file, { access: 'public' });
  uploadResponse = { Location: url };  

  const [data] = await pool.query<any>("INSERT INTO Templates SET ?", {
    tags: tag,
    description,
    file_path: uploadResponse.Location,
    // used_by: usedBy,
    document_name: document_name,
    created_by: createdBy,
  });
  console.log(data);
  return NextResponse.json({
    status: "success",
    message: "Template uploaded successfully",
    templateLocation: uploadResponse.Location,
  });
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const [rows] = await pool.query(
    "SELECT * FROM Templates Where created_by = ?",
    [id],
  );
  console.log(rows);

  return NextResponse.json(rows);
}

export async function DELETE(req: Request) {
  const url = new URL(req.url);
  const id = url.searchParams.get("id");
  const [rows] = await pool.query("DELETE FROM Templates WHERE id = ?", [id]);
  console.log(rows);

  return NextResponse.json(rows);
}
