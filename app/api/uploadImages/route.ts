import { v4 as uuidv4 } from "uuid";
import { NextRequest, NextResponse } from "next/server";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";

const s3Client = new S3Client({
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.S3_ACCESS_KEY!,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
  },
});

export async function POST(request: NextRequest) {
  try {
    console.log(
      process.env.AWS_ACCESS_KEY,
      process.env.AWS_SECRET_ACCESS_KEY,
      process.env.AWS_REGION,
      process.env.AWS_S3_BUCKET_NAME,
    );

    const formData = await request.formData();
    const files = formData.getAll("images") as File[];

    if (files.length === 0) {
      return NextResponse.json({ error: "No files uploaded" }, { status: 400 });
    }

    const uploadPromises = files.map(async (file) => {
      const buffer = await file.arrayBuffer();
      const fileName = `users/${uuidv4()}-${file.name}`;

      const command = new PutObjectCommand({
        Key: fileName,
        ContentType: file.type,
        Body: Buffer.from(buffer),
        Bucket: process.env.AWS_S3_BUCKET_NAME,
      });

      await s3Client.send(command);

      return `https://${process.env.AWS_S3_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
    });

    const uploadedUrls = await Promise.all(uploadPromises);

    return NextResponse.json({ urls: uploadedUrls }, { status: 200 });
  } catch (error) {
    console.error("Error uploading files:", error);
    return NextResponse.json(
      { error: "Error uploading files" },
      { status: 500 },
    );
  }
}
