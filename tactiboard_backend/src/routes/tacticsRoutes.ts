
import express from "express";
import multer from "multer";
import { createTactics, getTactics, deleteTactics } from "../controllers/tacticsController";

const router = express.Router();

// ルート設定
router.post(`/`, createTactics);
router.get(`/`, getTactics);
router.delete(`/`, deleteTactics);

export { router as tacticsRoutes };