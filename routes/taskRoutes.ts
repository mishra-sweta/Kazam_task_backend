import { Router } from "express";
import { getAllTasks, addTask } from "../controllers/taskController";

const taskRouter = Router();

taskRouter.get("/fetchAllTasks", getAllTasks);
taskRouter.post("/addTask", addTask);

export default taskRouter;
