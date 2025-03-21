"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRoutes = void 0;
const express_1 = __importDefault(require("express"));
const userController_1 = require("../controllers/userController");
const router = express_1.default.Router();
exports.userRoutes = router;
router.post(`/signup`, userController_1.signUp);
router.post(`/signin`, userController_1.signIn);
router.post(`/password/change`, userController_1.changePassword);
router.post(`/verifycode`, userController_1.sendVerification);
