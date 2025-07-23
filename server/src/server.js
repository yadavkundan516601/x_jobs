// src/server.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";
import connectRedis from "./config/redis.js";
import { logInfo, logError } from "./utils/logger.js";
import { connectDB } from "./config/db.js";

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

async function startServer() {
  try {
    // MongoDB
    await connectDB();
    logInfo("✅ MongoDB connected");

    // Redis
    await connectRedis();

    // Start cron and workers after Redis is connected
    await import("./cron/jobFetcher.js"); // Starts cron
    await import("./workers/jobWorker.js"); // Starts queue worker

    // Express
    app.listen(PORT, () => {
      logInfo(`🚀 Server running at http://localhost:${PORT}`);
    });
  } catch (error) {
    logError("❌ Failed to start server:", error);
    process.exit(1);
  }
}

startServer();
