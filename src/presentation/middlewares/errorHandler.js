const logger = require('../../shared/utils/logger');

/**
 * Global error handler middleware
 */
const errorHandler = (err, req, res, next) => {
  // Log the error with appropriate level
  const status = err.statusCode || 500;
  
  if (status >= 500) {
    logger.error(`Error: ${err.message}`, { 
      stack: err.stack,
      path: req.originalUrl,
      method: req.method,
      ip: req.ip
    });
  } else {
    logger.warn(`Error: ${err.message}`, {
      path: req.originalUrl,
      method: req.method
    });
  }
  
  // Default error status and message
  const message = err.statusCode ? err.message : 'Internal Server Error';
  
  // Return error response
  res.status(status).json({
    error: {
      message,
      status
    }
  });
};

module.exports = { errorHandler };
