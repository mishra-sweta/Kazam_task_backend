import { Router } from "express";
const taskRouter = Router();

taskRouter.get("/fetchAllTasks", async (req, res) => {
  try {
    const redisTasks = JSON.parse(await redisClient.get(REDIS_KEY)) || [];
    const mongoTasks = await Task.find();
    res.json([...redisTasks, ...mongoTasks.map((doc) => doc.task)]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default taskRouter;
