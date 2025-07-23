import ImportLog from "../models/ImportLog.model.js";

/**
 * @desc    Get paginated import logs
 * @route   GET /api/import-logs?page=1&limit=10
 * @access  Public (can add auth later)
 */
export const getImportLogs = async (req, res, next) => {
  try {
    const page = parseInt(req.query.page || "1", 10);
    const limit = parseInt(req.query.limit || "10", 10);
    const skip = (page - 1) * limit;

    const [logs, total] = await Promise.all([
      ImportLog.find()
        .sort({ timestamp: -1 }) // newest first
        .skip(skip)
        .limit(limit),
      ImportLog.countDocuments(),
    ]);

    res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      totalLogs: total,
      logs,
    });
  } catch (error) {
    next(error); // passes to global error handler
  }
};
