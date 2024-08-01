import {
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

export async function downloadS3Folder(prefix: string, bucket: string) {
  console.log("Downloading files from S3", prefix, bucket);
  if (
    !process.env.AWS_REGION ||
    !process.env.AWS_ACCESS_KEY_ID ||
    !process.env.AWS_SECRET_ACCESS_KEY
  ) {
    console.error("AWS credentials are not set");
    console.log(process.env.AWS_REGION, process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);
    return;
  }
  const s3Client = new S3Client({
    region: process.env.AWS_REGION,
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },
  });

  const command = new ListObjectsV2Command({
    Bucket: bucket,
    Prefix: prefix,
  });

  try {
    const response = await s3Client.send(command);
    const contents = response.Contents;
    if (!contents) {
      console.log("No files found");
      return;
    }

    for (const content of contents) {
      if (!content.Key) {
        continue;
      }

      const finalOutputPath = path.join(__dirname, content.Key);
      const outputFile = fs.createWriteStream(finalOutputPath);
      const dirName = path.dirname(finalOutputPath);
      if (!fs.existsSync(dirName)) {
        fs.mkdirSync(dirName, { recursive: true });
      }

      const getObjectCommand = new GetObjectCommand({
        Bucket: bucket,
        Key: content.Key,

      });

      const getObjectResponse = await s3Client.send(getObjectCommand);
      if (!getObjectResponse.Body) {
        console.log("No body found");
        continue;
      }
      // @ts-ignore
      getObjectResponse.Body.pipe(outputFile);
    }
  } catch (err) {
    console.error(err);
  }
}

// downloadS3Folder("output/ceq32jsf98", process.env.BUCKET_NAME!)
