"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const userRoutes_1 = require("./routes/userRoutes");
const teamRoutes_1 = require("./routes/teamRoutes");
dotenv_1.default.config();
const port = process.env.PORT;
const app = (0, express_1.default)();
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
app.use(express_1.default.json());
//ルーティング
app.use(`/api/${process.env.API_VERSION}/user`, userRoutes_1.userRoutes);
app.use(`/api/${process.env.API_VERSION}/team`, teamRoutes_1.teamRoutes);
