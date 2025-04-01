"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const config = {
    REDIS_HOST: process.env.REDIS_HOST || "127.0.0.1",
    REDIS_PORT: Number(process.env.REDIS_PORT) || 6379,
    REDIS_URL: "localhost:6379",
    STORAGE_PATH: "./processed/",
    BASE_URL: process.env.BASE_URL || "http://localhost",
    PORT: Number(process.env.PORT) || 3200,
};
exports.default = config;
