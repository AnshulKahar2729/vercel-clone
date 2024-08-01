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
exports.uploadToS3 = void 0;
const client_s3_1 = require("@aws-sdk/client-s3");
const fs_1 = __importDefault(require("fs"));
function uploadToS3(fileName, localFilePath) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            console.log("before uploading to S3");
            if (!process.env.AWS_REGION ||
                !process.env.AWS_ACCESS_KEY_ID ||
                !process.env.AWS_SECRET_ACCESS_KEY) {
                console.log("No AWS credentials found");
                console.log(process.env.AWS_REGION, process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY);
                return;
            }
            console.log("Uploading to S3", { fileName, localFilePath });
            const s3Client = new client_s3_1.S3Client({
                region: process.env.AWS_REGION,
                credentials: {
                    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
                    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
                },
            });
            const fileStream = fs_1.default.createReadStream(localFilePath);
            const bucketName = process.env.BUCKET_NAME;
            if (!bucketName)
                return;
            console.log("Uploading to S3", { fileName, bucketName, fileStream });
            yield s3Client.send(new client_s3_1.PutObjectCommand({
                Bucket: bucketName,
                Key: fileName,
                Body: fileStream,
            }));
        }
        catch (e) {
            console.log(e);
        }
    });
}
exports.uploadToS3 = uploadToS3;
