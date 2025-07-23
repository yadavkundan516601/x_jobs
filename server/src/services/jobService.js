import Job from "../models/Job.model.js";

/**
 * Inserts or updates a job based on externalId
 * @param {Object} jobData - job object from XML feed
 * @returns {Object} { isNew: Boolean, savedJob: Object }
 */
export const upsertJob = async (jobData) => {
  const existingJob = await Job.findOne({ externalId: jobData.externalId });

  if (existingJob) {
    // Update existing job
    existingJob.title = jobData.title;
    existingJob.description = jobData.description;
    existingJob.company = jobData.company;
    existingJob.pubDate = jobData.pubDate;
    existingJob.link = jobData.link;
    existingJob.sourceUrl = jobData.sourceUrl;
    existingJob.raw = jobData.raw;

    const updated = await existingJob.save();
    return { isNew: false, savedJob: updated };
  }

  // Insert new job
  const newJob = new Job(jobData);
  const saved = await newJob.save();
  return { isNew: true, savedJob: saved };
};
