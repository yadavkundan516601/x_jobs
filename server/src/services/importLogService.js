// src/services/importLogService.js
import ImportLog from "../models/ImportLog.model.js";

/**
 * Logs a job import attempt
 * @param {Object} params
 * @param {String} params.fileName - The source feed URL
 * @param {Number} params.totalFetched
 * @param {Number} params.totalImported
 * @param {Number} params.newJobs
 * @param {Number} params.updatedJobs
 * @param {Array} params.failedJobs - Array of { reason, jobId, jobData }
 */
export const logImportSummary = async ({
  fileName,
  totalFetched,
  totalImported,
  newJobs,
  updatedJobs,
  failedJobs = [],
}) => {
  await ImportLog.create({
    fileName,
    totalFetched,
    totalImported,
    newJobs,
    updatedJobs,
    failedJobs,
  });
};
