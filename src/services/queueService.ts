import config from '../config/config';
import Redis from "ioredis";
import {Queue} from "bullmq";

const redis = new Redis({ host: config.REDIS_HOST, port: config.REDIS_PORT });
export const mediaQueue = new Queue("mediaQueue", { connection: { host: config.REDIS_HOST, port: config.REDIS_PORT } });

export const addToQueue = async (type:any, filePath:any) => {
    const job = await mediaQueue.add(type, { filePath });
    await redis.set(`task:${job.id}`, JSON.stringify({ status: "Pending", filePath: null }));
    return job.id;
};

export const getTaskStatus = async (taskId:any) => {
    const cachedStatus = await redis.get(`task:${taskId}`);
    return cachedStatus ? JSON.parse(cachedStatus) : { error: "Task not found" };
};
