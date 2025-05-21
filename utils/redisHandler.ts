import redis from "redis";
import Task from "../model/taskModel.js";

export const REDIS_KEY = "FULLSTACK_TASK_Sweta";

const client = redis.createClient({
  socket: {
    host: "127.0.0.1",
    port: 6379,
  },
});

client.connect();

export const addTaskInCache = async (param: string): Promise<string | void | null> => {
  const task: string = JSON.parse(param);
  const cachedStr: string | null = await client.get(REDIS_KEY);
  const cached: string[] = cachedStr ? JSON.parse(cachedStr) : [];
  cached.push(task);

  if (cached.length > 50) {
    const toInsert = cached.slice(0, 50);
    const toKeep = cached.slice(50);

    await Task.insertMany(toInsert.map((t) => ({ task: t })));

    if (toKeep.length > 0) {
      return await client.set(REDIS_KEY, JSON.stringify(toKeep));
    } else {
      await client.del(REDIS_KEY);
      return null; 
    }
  } else {
    return await client.set(REDIS_KEY, JSON.stringify(cached));
  }
};

export default client;
