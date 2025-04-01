import dotenv from 'dotenv';


dotenv.config();

interface Config {
    REDIS_HOST: string;
    REDIS_PORT: number;
    REDIS_URL:string;
    STORAGE_PATH:string;
    BASE_URL:string
    PORT:number
}

const config: Config = {
    REDIS_HOST: process.env.REDIS_HOST || "127.0.0.1",
    REDIS_PORT:  Number(process.env.REDIS_PORT) || 6379,
    REDIS_URL: "localhost:6379",
    STORAGE_PATH: "./processed/",
    BASE_URL: process.env.BASE_URL || "http://localhost",
    PORT:Number(process.env.PORT) || 3200,
};

export default config;