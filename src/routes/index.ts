import { Router } from 'express';
import mediaRoutes from "./mediaRoutes";

const router = Router();

router.use("/media",mediaRoutes);

export default router;
