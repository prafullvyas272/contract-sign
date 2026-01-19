import AWS from "aws-sdk";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { NodeHttpHandler } from "@smithy/node-http-handler";

// export const s3 = new AWS.S3({
//   accessKeyId: process.env.AWS_ACCESS_KEY_ID,
//   secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
//   region: process.env.AWS_DEFAULT_REGION,
// });

export const s3 = new S3Client({
  region: process.env.AWS_DEFAULT_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
  maxAttempts: 3,
  requestHandler: new NodeHttpHandler({
    connectionTimeout: 30000,
    socketTimeout: 30000,
  }),
});

// export const uploadToS3 = async (file: File): Promise<any> => {
//   const fileContent = await file.arrayBuffer();
//   const fileName = file.name;
//   const mimeType = file.type;

//   const params: AWS.S3.PutObjectRequest = {
//     Bucket: process.env.AWS_BUCKET_NAME!,
//     Key: `contract-uploads/${fileName}`,
//     Body: fileContent,
//     ContentType: mimeType,
//     ACL: "public-read",
//   };

//   const uploadResult = await s3.upload(params).promise();

//   return uploadResult;
// };
