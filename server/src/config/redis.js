import { createClient } from "redis";
import { config } from "./env.js";

const redisClient = createClient({
  url: config.redisUrl,
});

redisClient.on("error", (err) => {
  console.error("❌ Redis error:", err);
});

redisClient.on("connect", () => {
  console.log("✅ Redis connected");
});

const connectRedis = async () => {
  await redisClient.connect();
};

export { redisClient };
export default connectRedis;
