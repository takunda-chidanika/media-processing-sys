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
exports.getTaskStatus = exports.addToQueue = exports.mediaQueue = void 0;
const config_1 = __importDefault(require("../config/config"));
const ioredis_1 = __importDefault(require("ioredis"));
const bullmq_1 = require("bullmq");
const redis = new ioredis_1.default({ host: config_1.default.REDIS_HOST, port: config_1.default.REDIS_PORT });
exports.mediaQueue = new bullmq_1.Queue("mediaQueue", { connection: { host: config_1.default.REDIS_HOST, port: config_1.default.REDIS_PORT } });
const addToQueue = (type, filePath) => __awaiter(void 0, void 0, void 0, function* () {
    const job = yield exports.mediaQueue.add(type, { filePath });
    yield redis.set(`task:${job.id}`, JSON.stringify({ status: "Pending", filePath: null }));
    return job.id;
});
exports.addToQueue = addToQueue;
const getTaskStatus = (taskId) => __awaiter(void 0, void 0, void 0, function* () {
    const cachedStatus = yield redis.get(`task:${taskId}`);
    return cachedStatus ? JSON.parse(cachedStatus) : { error: "Task not found" };
});
exports.getTaskStatus = getTaskStatus;
