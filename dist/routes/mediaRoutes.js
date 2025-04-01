"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
const express_1 = __importStar(require("express"));
const path_1 = __importDefault(require("path"));
const queueService_1 = require("../services/queueService");
const uploadService_1 = __importDefault(require("../services/uploadService"));
const router = (0, express_1.Router)();
// Serve media files (Nginx will handle this)
/**
 * @swagger
 * /media/:
 *   get:
 *     summary: Retrieve a processed media file
 *     description: Fetches and serves a processed media file from storage, allowing it to be viewed or downloaded.
 *     parameters:
 *       - in: path
 *         name: processedMediaName
 *         required: true
 *         schema:
 *           type: string
 *         description: The name of the processed media file.
 *     responses:
 *       200:
 *         description: Successfully retrieved the media file.
 *       400:
 *         description: Invalid media file name.
 *       404:
 *         description: Media file not found.
 */
router.use("/", express_1.default.static(path_1.default.join(__dirname, "processed")));
/**
 * @swagger
 * /media/:
 *   post:
 *     summary: Upload a media file for processing
 *     description: Uploads an image or video file for processing and returns a task ID to track the process.
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: The media file to upload.
 *     responses:
 *       200:
 *         description: Successfully uploaded the file and started processing.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "File uploaded and processing started"
 *                 taskId:
 *                   type: string
 *                   example: "123456"
 *       400:
 *         description: No file uploaded or invalid file format.
 */
router.post("/", uploadService_1.default.single("file"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const file = req.file;
    if (!file) {
        res.status(400).json({ error: "No file uploaded" });
    }
    const fileType = req.file.mimetype.startsWith("image") ? "image" : "video";
    const taskId = yield (0, queueService_1.addToQueue)(fileType, req.file.path);
    res.json({ message: "File uploaded and processing started", taskId });
}));
/**
 * @swagger
 * /media/status/{taskId}:
 *   get:
 *     summary: Get the status of a media processing task
 *     description: Returns the processing status of a media file and provides the processed file URL when available.
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *         description: The ID of the processing task.
 *     responses:
 *       200:
 *         description: Task status and processed media URL (if completed).
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 taskId:
 *                   type: string
 *                   example: "123456"
 *                 status:
 *                   type: string
 *                   example: "processing"
 *                 processedMediaUrl:
 *                   type: string
 *                   example: "http://localhost:3200/media/processed/video.mp4"
 *       400:
 *         description: Invalid task ID.
 *       404:
 *         description: Task not found.
 */
router.get("/status/:taskId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const status = yield (0, queueService_1.getTaskStatus)(req.params.taskId);
    res.json(status);
}));
exports.default = router;
