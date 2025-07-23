import { Queue } from "bullmq";
import { QUEUE_NAMES, queueConfig } from "../config/bullmq.js";

export const jobQueue = new Queue(QUEUE_NAMES.JOB_IMPORT, queueConfig);
