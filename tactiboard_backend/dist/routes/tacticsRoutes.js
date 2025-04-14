"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.tacticsRoutes = void 0;
const express_1 = __importDefault(require("express"));
const tacticsController_1 = require("../controllers/tacticsController");
const router = express_1.default.Router();
exports.tacticsRoutes = router;
// ルート設定
router.post(`/`, tacticsController_1.createTactics);
router.get(`/`, tacticsController_1.getTactics);
router.delete(`/`, tacticsController_1.deleteTactics);
