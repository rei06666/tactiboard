import express from "express";
import { getActivity } from "../controllers/activityController";

const router = express.Router();
router.get(`/`, getActivity);

export { router as activityRoutes };
