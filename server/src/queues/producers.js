// src/queues/producers.js
import { jobQueue } from "./jobQueue.js";
import { config } from "../config/env.js";

/**
 * Add multiple jobs to the job import queue
 * @param {Array} jobs - Array of job objects fetched from feeds
 */
export const addJobsToQueue = async (jobs = []) => {
  const chunks = chunkArray(jobs, config.batchSize);

  for (const batch of chunks) {
    await jobQueue.addBulk(
      batch.map((job) => ({
        name: job.externalId || job.link || "job", // optional name
        data: job,
      }))
    );
  }

  console.log(`📤 Enqueued ${jobs.length} jobs in ${chunks.length} batches.`);
};

/**
 * Splits an array into chunks
 */
function chunkArray(array, size) {
  const result = [];
  for (let i = 0; i < array.length; i += size) {
    result.push(array.slice(i, i + size));
  }
  return result;
}
