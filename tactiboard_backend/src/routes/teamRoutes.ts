import express from "express";
import multer from "multer";
import { createTeam, getTeam, deleteTeam, leaveTeam, JoinTeam, RejectTeam } from "../controllers/teamController";

const router = express.Router();

// multerの設定 (MemoryStorageを使用)
const storage = multer.memoryStorage();
const upload = multer({ storage });

// ルート設定
router.post(`/`, upload.single("emblem"), createTeam);
router.get(`/`, getTeam);
router.delete(`/`, deleteTeam);
router.delete(`/leave`, leaveTeam)
router.post(`/accept_invite`, JoinTeam)
router.post(`/reject_invite`, RejectTeam)

export { router as teamRoutes };