import "dotenv/config";
import express from "express";
import bodyParser from "body-parser";
import taskRouter from "./routes/taskRoutes.js";
import connectDB from "./utils/dbConnect.js";

const app = express();
app.use(bodyParser.json());

connectDB();

app.use("/api/", taskRouter);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log("Server running on http://localhost:3000"));
