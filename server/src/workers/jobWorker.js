import { Worker } from "bullmq";
import { QUEUE_NAMES, queueConfig } from "../config/bullmq.js";
import { upsertJob } from "../services/jobService.js";
import { logImportSummary } from "../services/importLogService.js";
import { logInfo, logError } from "../utils/logger.js";
import { config } from "../config/env.js";

let summary = {
  fileName: "", // Will be set from the job data
  totalFetched: 0,
  totalImported: 0,
  newJobs: 0,
  updatedJobs: 0,
  failedJobs: [],
};

let initialized = false;
let flushTimeout = null;

// ⏱ Flush summary to DB after idle time
const scheduleFlush = () => {
  clearTimeout(flushTimeout);
  flushTimeout = setTimeout(async () => {
    await flushSummaryToDB();
  }, 10_000); // 10s delay after last job
};

const flushSummaryToDB = async () => {
  if (!initialized || summary.totalFetched === 0) return;

  try {
    await logImportSummary(summary);
    logInfo("✅ Import summary logged to DB:", summary);
  } catch (err) {
    logError("❌ Failed to log import summary:", err);
  }

  // Reset summary
  initialized = false;
  summary = {
    fileName: "",
    totalFetched: 0,
    totalImported: 0,
    newJobs: 0,
    updatedJobs: 0,
    failedJobs: [],
  };
};

// 🎯 Worker to process each job
const worker = new Worker(
  QUEUE_NAMES.JOB_IMPORT,
  async (job) => {
    const jobData = job.data;
    summary.totalFetched += 1;

    if (!initialized) {
      summary.fileName = jobData.sourceUrl || "unknown-source";
      initialized = true;
    }

    try {
      const { isNew } = await upsertJob(jobData);

      summary.totalImported += 1;
      if (isNew) summary.newJobs += 1;
      else summary.updatedJobs += 1;
    } catch (err) {
      summary.failedJobs.push({
        reason: err.message,
        jobId: jobData.externalId || jobData.link || "",
        jobData,
      });
      logError(`Job failed [${jobData.externalId}]:`, err.message);
    }

    scheduleFlush(); // Schedule DB write after each job
  },
  {
    ...queueConfig,
    concurrency: config.concurrency,
  }
);

// Worker lifecycle events
worker.on("completed", (job) => {
  logInfo(`✅ Job completed: ${job.name}`);
});

worker.on("failed", (job, err) => {
  logError(`❌ Job failed: ${job.name}`, err.message);
});

logInfo("👷 Job worker started...");
