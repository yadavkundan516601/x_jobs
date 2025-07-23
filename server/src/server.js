// src/server.js
import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";
import connectRedis from "./config/redis.js";
import { logInfo, logError } from "./utils/logger.js";
import "./cron/jobFetcher.js"; // Starts cron
import "./workers/jobWorker.js"; // Starts queue worker

dotenv.config();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

async function startServer() {
  try {
    // MongoDB
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logInfo("✅ MongoDB connected");

    // Redis
    await connectRedis();

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
