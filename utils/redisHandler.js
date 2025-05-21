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

export const addTaskInCache = async (param) => {
  const task = JSON.parse(param);
  const cached = JSON.parse(await client.get(REDIS_KEY)) || [];
  cached.push(task);
  let resp;
  if (cached.length > 3) {
    const toInsert = cached.slice(0, 3);
    const toKeep = cached.slice(3);

    await Task.insertMany(toInsert.map((task) => ({ task })));

    if (toKeep.length > 0) {
      await client.set(REDIS_KEY, JSON.stringify(toKeep));
    } else {
      await client.del(REDIS_KEY);
    }
  } else {
    resp = await client.set(REDIS_KEY, JSON.stringify(cached));
  }

  return resp;
};

export default client;
