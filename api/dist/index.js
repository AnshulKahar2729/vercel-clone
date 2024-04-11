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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const simple_git_1 = __importDefault(require("simple-git"));
const randomid_1 = require("./utils/randomid");
const path_1 = __importDefault(require("path"));
const files_1 = require("./utils/files");
const aws_1 = require("./utils/aws");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/deploy", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { repoUrl } = req.body;
        console.log(repoUrl);
        const id = (0, randomid_1.randomId)(10);
        console.log(id);
        console.log(__dirname);
        yield (0, simple_git_1.default)().clone(repoUrl, path_1.default.join(__dirname, `output/${id}`));
        const files = yield (0, files_1.getAllFiles)(path_1.default.join(__dirname, `output/${id}`));
        files.forEach((file) => __awaiter(void 0, void 0, void 0, function* () {
            const localFilePath = file;
            const fileName = file.slice(__dirname.length + 1);
            yield (0, aws_1.uploadToS3)(fileName, localFilePath);
        }));
        res.json({ msg: "Deploying done!" });
    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: `Error in deployment : ${error}` });
    }
}));
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
