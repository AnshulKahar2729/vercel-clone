import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import fs from "fs";



export async function uploadToS3(fileName: string, localFilePath: string) {
  try {
    console.log("before uploading to S3")
    if (
      !process.env.AWS_REGION ||
      !process.env.AWS_ACCESS_KEY_ID ||
      !process.env.AWS_SECRET_ACCESS_KEY
    ){
      console.log("No AWS credentials found");
      console.log(process.env.AWS_REGION, process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);
      return;
    }
      console.log("Uploading to S3", { fileName, localFilePath });
    const s3Client = new S3Client({
      region: process.env.AWS_REGION,
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
      },
    });

    const fileStream = fs.createReadStream(localFilePath);

    const bucketName = process.env.BUCKET_NAME;
    if (!bucketName) return;
    console.log("Uploading to S3", { fileName, bucketName, fileStream});
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: fileStream,
      })
    );
  } catch (e) {
    console.log(e);
  }
}
