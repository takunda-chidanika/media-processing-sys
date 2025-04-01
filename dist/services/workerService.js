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
const path_1 = __importDefault(require("path"));
const ioredis_1 = __importDefault(require("ioredis"));
const config_1 = __importDefault(require("../config/config"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const gm_1 = __importDefault(require("gm"));
const bullmq_1 = require("bullmq");
const redis = new ioredis_1.default({ host: config_1.default.REDIS_HOST, port: config_1.default.REDIS_PORT });
const CACHE_EXPIRATION = 86400;
const processImage = (filePath) => {
    return new Promise((resolve, reject) => {
        const fileName = `${Date.now()}.jpg`;
        const outputPath = path_1.default.join(config_1.default.STORAGE_PATH, fileName);
        (0, gm_1.default)(filePath).resize(200, 200, "!").setFormat("jpg").write(outputPath, (err) => {
            if (err)
                return reject(err);
            resolve(fileName);
        });
    });
};
const processVideo = (filePath) => {
    return new Promise((resolve, reject) => {
        const videoFile = `${Date.now()}.avi`;
        const thumbnailFile = `${Date.now()}.jpg`;
        const outputPath = path_1.default.join(config_1.default.STORAGE_PATH, videoFile);
        (0, fluent_ffmpeg_1.default)(filePath)
            .on("end", () => resolve({ video: videoFile, thumbnail: thumbnailFile }))
            .on("error", reject)
            .screenshots({ timestamps: ["5%"], filename: thumbnailFile, folder: config_1.default.STORAGE_PATH })
            .output(outputPath)
            .run();
    });
};
new bullmq_1.Worker("mediaQueue", (job) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Processing ${job.name}: ${job.data.filePath}`);
    yield redis.set(`task:${job.id}`, JSON.stringify({ status: "In Progress", filePath: null }));
    let result;
    if (job.name === "image") {
        result = yield processImage(job.data.filePath);
    }
    else if (job.name === "video") {
        result = yield processVideo(job.data.filePath);
    }
    const fileUrl = typeof result === "string"
        ? `${config_1.default.BASE_URL}/media/${result}`
        : {
            video: `${config_1.default.BASE_URL}/media/${result.video}`,
            thumbnail: `${config_1.default.BASE_URL}/media/${result.thumbnail}`
        };
    yield redis.setex(`task:${job.id}`, CACHE_EXPIRATION, JSON.stringify({ status: "Completed", filePath: fileUrl }));
    return fileUrl;
}), { connection: { host: config_1.default.REDIS_HOST, port: config_1.default.REDIS_PORT },
    concurrency: 5, });
