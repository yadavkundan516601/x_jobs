// src/utils/logger.js

/**
 * Logs a success/info message
 * @param  {...any} args
 */
export const logInfo = (...args) => {
  console.log("ℹ️", ...args);
};

/**
 * Logs a warning
 * @param  {...any} args
 */
export const logWarning = (...args) => {
  console.warn("⚠️", ...args);
};

/**
/**
 * Logs an error
 * @param  {...any} args
 */
export const logError = (...args) => {
  console.error("❌", ...args);
};
