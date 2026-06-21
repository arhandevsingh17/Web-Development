// middleware/errorHandler.js
// Simple centralised error handler + request logger to logs/app.log

const fs = require("fs");
const path = require("path");

const logFile = path.join(__dirname, "..", "logs", "app.log");

function logToFile(message) {
  const line = `[${new Date().toISOString()}] ${message}\n`;
  fs.appendFile(logFile, line, (err) => {
    if (err) console.error("Failed to write log:", err.message);
  });
}

// 404 handler - for routes that don't exist
function notFound(req, res, next) {
  res.status(404);
  const err = new Error(`Page not found - ${req.originalUrl}`);
  next(err);
}

// General error handler
function errorHandler(err, req, res, next) {
  const statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;

  logToFile(`ERROR ${statusCode} - ${err.message} - ${req.originalUrl}`);

  // If request expects JSON (API call)
  if (req.originalUrl.startsWith("/api")) {
    return res.status(statusCode).json({
      success: false,
      message: err.message || "Something went wrong",
    });
  }

  // Otherwise render a simple error page / message
  res.status(statusCode).send(`
    <div style="font-family: Arial; padding: 40px;">
      <h2>Something went wrong</h2>
      <p>${err.message}</p>
      <a href="/">Go back to Dashboard</a>
    </div>
  `);
}

module.exports = { notFound, errorHandler, logToFile };
