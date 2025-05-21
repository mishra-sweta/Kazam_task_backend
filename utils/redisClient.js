import redis from "redis";
const client = redis.createClient({
  socket: {
    host: "redis-.ap-south-1-1.ec2.cloud.redislabs.com",
    port: 12675,
  },
  username: "default",
  password: process.env.REDIS_PASSWORD,
});

client.connect();

export default client;
