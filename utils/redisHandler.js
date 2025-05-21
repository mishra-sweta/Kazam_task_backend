import redis from "redis";
import Task from "../model/taskModel.js";

export const REDIS_KEY = "FULLSTACK_TASK_Sweta";
const REDIS_HOST = "redis-12675.c212.ap-south-1-1.ec2.cloud.redislabs.com";
const REDIS_PORT = 12675;

const client = redis.createClient({
  socket: {
    host: REDIS_HOST,
    port: REDIS_PORT,
  },
  username: "default",
  password: process.env.REDIS_PASSWORD,
});

client.connect();

export const addTaskInCache = async (param) => {
  const task = JSON.parse(param);
  const cached = JSON.parse(await client.get(REDIS_KEY)) || [];
  cached.push(task);
  let resp;
  if (cached.length > 50) {
    const toInsert = cached.slice(0, 50);
    const toKeep = cached.slice(50);

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
