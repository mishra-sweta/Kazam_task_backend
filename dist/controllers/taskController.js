import redisClient, { REDIS_KEY } from "../utils/redisHandler.js";
import Task from "../model/taskModel.js";
import { publishTask } from "../utils/mqttHandler.js";
const getAllTasks = async (req, res) => {
  try {
    const redisData = await redisClient.get(REDIS_KEY);
    let redisTasks = [];
    if (redisData) {
      redisTasks = JSON.parse(redisData);
    }
    const mongoTasks = await Task.find({}).select("task -_id");
    const tasks = mongoTasks.map((e) => e.task);
    const allTasks = [...tasks, ...redisTasks];
    res.status(200).json({ success: true, tasks: allTasks });
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
const addTask = async (req, res) => {
  const { task } = req.body;
  if (!task || typeof task !== "string") {
    res.status(400).json({ success: false, message: "Invalid task" });
    return;
  }
  publishTask("/add", task);
  res
    .status(200)
    .json({ message: "Task added and published successfully.", task });
};
export { getAllTasks, addTask };
