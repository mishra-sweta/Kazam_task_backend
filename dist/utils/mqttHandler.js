import { connect } from "mqtt";
import { addTaskInCache } from "./redisHandler.js";

let mqttClient = null;
export const mqttConnect = () => {
  mqttClient = connect(
    "mqtts://0adf676947c4457daa020e02cc8011b5.s1.eu.hivemq.cloud:8883",
    {
      username: "swetacodes",
      password: "Kazma123",
    }
  );
  mqttClient.on("connect", () => {
    console.log("Connected to HiveMQ!");
    mqttClient?.subscribe("/add", (err) => {
      if (!err) {
        console.log("Subscribed to /add");
      } else {
        console.error("Subscription error:", err);
      }
    });
  });
  mqttClient.on("message", async (topic, message) => {
    console.log(`Received on ${topic}: ${message.toString()}`);
    await addTaskInCache(message.toString());
  });
  mqttClient.on("error", (err) => {
    console.error("MQTT Error:", err.message);
  });
  return mqttClient;
};
export const publishTask = (topic, task) => {
  if (!mqttClient || !mqttClient.connected) {
    console.error("MQTT not connected. Cannot publish.");
    return;
  }
  mqttClient.publish(topic, JSON.stringify(task), (err) => {
    if (err) {
      console.error("Failed to publish task:", err);
    } else {
      console.log(`Task published to ${topic}:`, task);
    }
  });
};
export default mqttClient;
