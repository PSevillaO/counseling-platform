const fs = require("fs");
const path = require("path");

const logsDir = path.join(__dirname, "../../logs");
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const LOG_LEVELS = { error: 0, warn: 1, info: 2, debug: 3 };
const LOG_LEVEL = LOG_LEVELS[process.env.LOG_LEVEL || "info"];

const formatLog = (level, message, data = {}) => {
  return JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    message,
    ...data,
  });
};

const writeLog = (level, message, data = {}) => {
  const logEntry = formatLog(level, message, data);
  console.log(logEntry);
};

const logger = {
  error: (message, data) => {
    if (LOG_LEVEL >= LOG_LEVELS.error) writeLog("ERROR", message, data);
  },
  warn: (message, data) => {
    if (LOG_LEVEL >= LOG_LEVELS.warn) writeLog("WARN", message, data);
  },
  info: (message, data) => {
    if (LOG_LEVEL >= LOG_LEVELS.info) writeLog("INFO", message, data);
  },
  debug: (message, data) => {
    if (LOG_LEVEL >= LOG_LEVELS.debug) writeLog("DEBUG", message, data);
  },
};

module.exports = logger;
