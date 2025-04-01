import path from "path";
import Redis from "ioredis";
import config from "../config/config"
import ffmpeg from "fluent-ffmpeg";
import gm from "gm";
import {Worker} from "bullmq";

const redis = new Redis({ host: config.REDIS_HOST, port: config.REDIS_PORT });
const CACHE_EXPIRATION = 86400;

const processImage = (filePath) => {
    return new Promise((resolve, reject) => {
        const fileName = `${Date.now()}.jpg`;
        const outputPath = path.join(config.STORAGE_PATH, fileName);
        gm(filePath).resize(200, 200,"!").setFormat("jpg").write(outputPath, (err) => {
            if (err) return reject(err);
            resolve(fileName);
        });
    });
};

const processVideo = (filePath) => {
    return new Promise((resolve, reject) => {
        const videoFile = `${Date.now()}.avi`;
        const thumbnailFile = `${Date.now()}.jpg`;
        const outputPath = path.join(config.STORAGE_PATH, videoFile);

        ffmpeg(filePath)
            .on("end", () => resolve({ video: videoFile, thumbnail: thumbnailFile }))
            .on("error", reject)
            .screenshots({ timestamps: ["5%"], filename: thumbnailFile, folder: config.STORAGE_PATH })
            .output(outputPath)
            .run();
    });
};

new Worker(
    "mediaQueue",
    async (job) => {
        console.log(`Processing ${job.name}: ${job.data.filePath}`);

        await redis.set(`task:${job.id}`, JSON.stringify({ status: "In Progress", filePath: null }));

        let result;
        if (job.name === "image") {
            result = await processImage(job.data.filePath);
        } else if (job.name === "video") {
            result = await processVideo(job.data.filePath);
        }

        const fileUrl = typeof result === "string"
            ? `${config.BASE_URL}/media/${result}`
            : {
                video: `${config.BASE_URL}/media/${result.video}`,
                thumbnail: `${config.BASE_URL}/media/${result.thumbnail}`
            };

        await redis.setex(`task:${job.id}`, CACHE_EXPIRATION, JSON.stringify({ status: "Completed", filePath: fileUrl }));

        return fileUrl;
    },
    { connection: { host: config.REDIS_HOST, port: config.REDIS_PORT },
        concurrency: 5, }
);