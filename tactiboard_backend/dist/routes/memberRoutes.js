"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.memberRoutes = void 0;
const express_1 = __importDefault(require("express"));
const memberController_1 = require("../controllers/memberController");
const router = express_1.default.Router();
exports.memberRoutes = router;
router.get(`/`, memberController_1.getMember);
router.post(`/invite`, memberController_1.inviteMember);
