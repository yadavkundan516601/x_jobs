import mongoose from "mongoose";

const failedJobSchema = new mongoose.Schema(
  {
    reason: String,
    jobId: String,
    jobData: Object,
  },
  { _id: false }
);

const importLogSchema = new mongoose.Schema({
  fileName: { type: String, required: true }, // source URL
  timestamp: { type: Date, default: Date.now },
  totalFetched: { type: Number, required: true },
  totalImported: { type: Number, required: true },
  newJobs: { type: Number, required: true },
  updatedJobs: { type: Number, required: true },
  failedJobs: [failedJobSchema], // list of failures with reasons
});

const ImportLog = mongoose.model("ImportLog", importLogSchema);

export default ImportLog;
