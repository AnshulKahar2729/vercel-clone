"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadS3Folder = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
function downloadS3Folder(prefix, bucket) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("Downloading files from S3", prefix, bucket);
        if (!process.env.AWS_REGION ||
            !process.env.AWS_ACCESS_KEY_ID ||
            !process.env.AWS_SECRET_ACCESS_KEY) {
            console.error("AWS credentials are not set");
            console.log(process.env.AWS_REGION, process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);
            return;
        }
        const s3Client = new client_s3_1.S3Client({
            region: process.env.AWS_REGION,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
            },
        });
        const command = new client_s3_1.ListObjectsV2Command({
            Bucket: bucket,
            Prefix: prefix,
        });
        try {
            const response = yield s3Client.send(command);
            const contents = response.Contents;
            if (!contents) {
                console.log("No files found");
                return;
            }
            for (const content of contents) {
                if (!content.Key) {
                    continue;
                }
                const finalOutputPath = path_1.default.join(__dirname, content.Key);
                const outputFile = fs_1.default.createWriteStream(finalOutputPath);
                const dirName = path_1.default.dirname(finalOutputPath);
                if (!fs_1.default.existsSync(dirName)) {
                    fs_1.default.mkdirSync(dirName, { recursive: true });
                }
                const getObjectCommand = new client_s3_1.GetObjectCommand({
                    Bucket: bucket,
                    Key: content.Key,
                });
                const getObjectResponse = yield s3Client.send(getObjectCommand);
                if (!getObjectResponse.Body) {
                    console.log("No body found");
                    continue;
                }
                // @ts-ignore
                getObjectResponse.Body.pipe(outputFile);
            }
        }
        catch (err) {
            console.error(err);
        }
    });
}
exports.downloadS3Folder = downloadS3Folder;
// downloadS3Folder("output/ceq32jsf98", process.env.BUCKET_NAME!)
