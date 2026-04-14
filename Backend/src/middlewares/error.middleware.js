/**
 * Global Error Handling Middleware
 * Must be placed AFTER all routes in app.js
 */

const errorHandler = (err, req, res, next) => {
  console.error("🔥 ERROR:", err);

  // Default values
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  res.status(statusCode).json({
    success: false,
    message,
    // Show stack only in development
    stack: process.env.NODE_ENV === "development" ? err.stack : undefined,
  });
};

module.exports = errorHandler;