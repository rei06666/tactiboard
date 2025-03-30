import express from "express";
import dotenv from "dotenv";
import { userRoutes } from "./routes/userRoutes";
import { teamRoutes } from "./routes/teamRoutes";
import { memberRoutes } from "./routes/memberRoutes";

dotenv.config();
const port = process.env.PORT;

const app = express();

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})

app.use(express.json());

//ルーティング
app.use(`/api/${process.env.API_VERSION}/user`, userRoutes);
app.use(`/api/${process.env.API_VERSION}/team`, teamRoutes);
app.use(`/api/${process.env.API_VERSION}/member`, memberRoutes);