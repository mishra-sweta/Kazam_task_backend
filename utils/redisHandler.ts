import redis from "redis";
import Task from "../model/taskModel.js";


export const REDIS_KEY = "FULLSTACK_TASK_Sweta";

const client = redis.createClient({
  socket: {
    host: "127.0.0.1",
    port: 6379,
  },
  // username: "default",
  // password: process.env.REDIS_PASSWORD,
});

client.connect();

interface TaskItem {
  task: string;
}

export const addTaskInCache = async (param: string): Promise<string | void | null> => {
  const task: TaskItem = JSON.parse(param);
  const cachedStr = await client.get(REDIS_KEY);
  const cached: TaskItem[] = cachedStr ? JSON.parse(cachedStr) : [];
  cached.push(task);

  if (cached.length > 3) {
    const toInsert = cached.slice(0, 3);
    const toKeep = cached.slice(3);

  
    await Task.insertMany(toInsert.map((t) => ({ task: t.task })));

    if (toKeep.length > 0) {
      return await client.set(REDIS_KEY, JSON.stringify(toKeep));
    } else {
      await client.del(REDIS_KEY);
      return;
    }
  } else {
    return await client.set(REDIS_KEY, JSON.stringify(cached));
  }
};

export default client;
