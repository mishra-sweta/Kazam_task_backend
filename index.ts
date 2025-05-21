// src/index.ts
import "dotenv/config";
import express, { Application } from "express";
import bodyParser from "body-parser";
import cors from "cors";

import { mqttConnect } from "./utils/mqttHandler";
import taskRouter from "./routes/taskRoutes";
import connectDB from "./utils/dbConnect";

const app: Application = express();

app.use(bodyParser.json());
app.use(cors());

connectDB();
mqttConnect();

app.use("/api/", taskRouter);

const PORT: number | string = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
