import { commandOptions, createClient } from "redis";
import { downloadS3Folder } from "./aws";
import dotenv from "dotenv";
dotenv.config();

async function main() {
  const subscriber = createClient();
  await subscriber.connect();

  while (true) {
    const response = await subscriber.brPop(
      commandOptions({ isolated: true }),
      "build-queue",
      0
    );
    // @ts-ignore
    const id = response.element;
    // console.log(id);
    console.log("Received message", response);
    if(process.env.BUCKET_NAME === undefined) {
      console.error("BUCKET_NAME is not set");
      return;
    }
    await downloadS3Folder(`output/${id}`, process.env.BUCKET_NAME);
  }
}

main();
