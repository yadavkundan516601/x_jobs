// src/cron/jobFetcher.js
import cron from "node-cron";
import { fetchJobsFromAllAPIs } from "../jobs/index.js";
import { addJobsToQueue } from "../queues/producers.js";
import { config } from "../config/env.js";

// Run immediately on startup as well
runJobFetch();

cron.schedule(config.cronSchedule, () => {
  console.log("⏰ CRON: Running scheduled job import task...");
  runJobFetch();
});

async function runJobFetch() {
  try {
    const allJobs = await fetchJobsFromAllAPIs();

    if (!allJobs || allJobs.length === 0) {
      console.log("⚠️ No jobs fetched from APIs");
      return;
    }

    console.log(`📥 Fetched ${allJobs.length} jobs. Enqueuing...`);

    // Enqueue jobs in batches
    await addJobsToQueue(allJobs);

    console.log("✅ Jobs enqueued for processing.");
  } catch (err) {
    console.error("❌ Error in job fetch cron:", err);
  }
}
