import express, { Request, Response, Router } from "express";
import path from "path";
import { addToQueue, getTaskStatus } from "../services/queueService";
import upload from "../services/uploadService";

const router = Router();

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
router.use("/", express.static(path.join(__dirname, "processed")));

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
router.post("/", upload.single("file"), async (req: Request, res: Response) => {
    const file = req.file as Express.Multer.File;

    if (!file) {
        res.status(400).json({ error: "No file uploaded" });
    }

    const fileType = req.file.mimetype.startsWith("image") ? "image" : "video";
    const taskId = await addToQueue(fileType, req.file.path);

    res.json({ message: "File uploaded and processing started", taskId });
});

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
router.get("/status/:taskId", async (req: Request, res: Response) => {
    const status = await getTaskStatus(req.params.taskId);
    res.json(status);
});

export default router;
