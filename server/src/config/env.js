import dotenv from "dotenv";

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  mongoUri: process.env.MONGO_URI,
  redisUrl: process.env.REDIS_URL || "redis://127.0.0.1:6379",
  concurrency: parseInt(process.env.JOB_CONCURRENCY || "5", 10),
  batchSize: parseInt(process.env.JOB_BATCH_SIZE || "100", 10),
  cronSchedule: process.env.SCHEDULE,
};
