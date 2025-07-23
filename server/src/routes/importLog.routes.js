import express from "express";
import { getImportLogs } from "../controllers/importLog.controller.js";

const router = express.Router();

// GET /api/import-logs
router.get("/", getImportLogs);

export default router;
