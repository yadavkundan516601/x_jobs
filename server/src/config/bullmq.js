import { config } from "./env.js";

export const queueConfig = {
  connection: {
    host: new URL(config.redisUrl).hostname,
    port: parseInt(new URL(config.redisUrl).port, 10),
  },
};

export const QUEUE_NAMES = {
  JOB_IMPORT: "job-import-queue",
};
