import express from "express";
import morgan from "morgan";
import dotenv from "dotenv";
import cors from "cors";

import importLogRoutes from "./routes/importLog.routes.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";

dotenv.config();

const app = express();

// Middlewares
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

// Routes
app.use("/api/import-logs", importLogRoutes);

// 404 Handler
app.use(notFound);

// Error Handler
app.use(errorHandler);

export default app;
