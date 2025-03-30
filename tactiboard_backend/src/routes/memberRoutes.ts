import express from "express";
import { getMember, inviteMember } from "../controllers/memberController";

const router = express.Router();
router.get(`/`, getMember);
router.post(`/invite`, inviteMember);

export { router as memberRoutes };
