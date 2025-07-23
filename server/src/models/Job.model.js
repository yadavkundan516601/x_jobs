import mongoose from "mongoose";

const jobSchema = new mongoose.Schema(
  {
    externalId: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: String,
    fullContent: String, // content:encoded
    company: String,
    pubDate: Date,
    link: String,
    location: String,
    jobType: String,
    mediaUrl: String,
    sourceUrl: String,
    raw: Object, // store full original item
  },
  { timestamps: true }
);

const Job = mongoose.model("Job", jobSchema);

export default Job;
