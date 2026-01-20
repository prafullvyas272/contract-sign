import { s3 } from "@/lib/aws-s3";
import pool from "@/lib/mysql";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";
import { Upload } from "@aws-sdk/lib-storage";
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { pipeline } from "stream/promises";

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

  // Upload file to AWS S3
  let uploadResponse = { Location: "" };

  // process.env.NODE_ENV === "production"  TODO: when aws setup we need to use this condition
  if (false) {
    const uploadParams = {
      Bucket: process.env.AWS_BUCKET_NAME!,
      Key: `templates/${file.name}`,
      Body: file.stream(),
      ContentType: file.type,
    };
  
    const upload = new Upload({
      client: s3,
      params: uploadParams,
    });
    const uploadResponse = await upload.done();

  } else {
    // write code to upload file in local folder with unix timestamp in file name and path
    const uploadDir = path.join(process.cwd(), "public", "uploads");

    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Attach unix timestamp to filename before the extension, e.g. myfile_1718172718.pdf
    const timestamp = Date.now();
    const ext = path.extname(file.name);
    const baseName = path.basename(file.name, ext);
    const uniqueFileName = `${timestamp}${ext}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    // Stream file to local disk
    await pipeline(
      file.stream(),
      fs.createWriteStream(filePath)
    );

    uploadResponse = {
      Location: `/uploads/${uniqueFileName}`, // matches S3 Location usage
    };

  }
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
