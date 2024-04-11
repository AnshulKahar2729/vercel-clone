import express from "express";
import cors from "cors";
import simpleGit from "simple-git";
import { randomId } from "./utils/randomid";
import path from "path";
import { getAllFiles } from "./utils/files";
import { uploadToS3 } from "./utils/aws";
import dotenv from 'dotenv';
dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

app.post("/deploy", async (req, res) => {
  try {
    const { repoUrl }: { repoUrl: string } = req.body;
    console.log(repoUrl);

    const id = randomId(10);
    console.log(id);
    console.log(__dirname);
    await simpleGit().clone(repoUrl, path.join(__dirname, `output/${id}`));

    const files: string[] = await getAllFiles(
      path.join(__dirname, `output/${id}`)
    );

    files.forEach(async (file) => {
      const localFilePath = file;
      const fileName = file.slice(__dirname.length + 1);
      await uploadToS3(fileName, localFilePath);
    });

    res.json({ msg: "Deploying done!" , id : id});
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `Error in deployment : ${error}` });
  }
});

app.listen(3000, () => {
  console.log("Server is running on port 3000");
});
