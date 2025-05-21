import { connect } from "mqtt";
import redisClient from "./utils/redisClient";
import Task from "./model/taskModel";

const client = connect("mqtt://broker.hivemq.com");

client.on("connect", () => {
  console.log("MQTT Connected");
  client.subscribe("/add");
});

const REDIS_KEY = "FULLSTACK_TASK_Sweta";
client.on("message", async (topic, message) => {
  if (topic === "/add") {
    const task = message.toString();
    const cached = JSON.parse(await redisClient.get(REDIS_KEY)) || [];
    cached.push(task);

    if (cached.length > 50) {
      await Task.insertMany(cached.map((task) => ({ task })));
      await redisClient.del(REDIS_KEY);
    } else {
      await redisClient.set(REDIS_KEY, JSON.stringify(cached));
    }
  }
});

export default client;
