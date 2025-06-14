const rateLimit = require('express-rate-limit');
const config = require('../../shared/config/config');
const logger = require('../../shared/utils/logger');

/**
 * Rate limiter middleware to prevent abuse
 * @param {Object} options - Rate limiting options
 * @returns {Function} Express middleware
 */
const createRateLimiter = (options = {}) => {
  const defaultOptions = {
    windowMs: config.rateLimit.windowMs,
    max: config.rateLimit.max,
    standardHeaders: true, // Return rate limit info in headers
    legacyHeaders: false, // Disable X-RateLimit headers
    message: {
      error: {
        message: 'Too many requests, please try again later',
        status: 429
      }
    },
    // Log rate limiting events
    handler: (req, res, next, options) => {
      logger.warn(`Rate limit exceeded: ${req.ip}`);
      res.status(options.statusCode).json(options.message);
    }
  };

  const limiterOptions = { ...defaultOptions, ...options };

  return rateLimit(limiterOptions);
};

module.exports = { createRateLimiter };
