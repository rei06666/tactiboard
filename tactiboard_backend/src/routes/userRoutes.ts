import express from "express";
import { signUp, signIn, changePassword, sendVerification } from "../controllers/userController";

const router = express.Router();
router.post(`/signup`, signUp);
router.post(`/signin`, signIn);
router.post(`/password/change`, changePassword)
router.post(`/verifycode`, sendVerification)

export { router as userRoutes };
