"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.teamRoutes = void 0;
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const teamController_1 = require("../controllers/teamController");
const router = express_1.default.Router();
exports.teamRoutes = router;
// multerの設定 (MemoryStorageを使用)
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({ storage });
// ルート設定
router.post(`/`, upload.single("emblem"), teamController_1.createTeam);
router.get(`/`, teamController_1.getTeam);
