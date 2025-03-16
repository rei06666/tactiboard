import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();
const port = process.env.PORT;

const app = express();

app.get("/", (req, res) => {
    res.send("hello world");
})

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
})