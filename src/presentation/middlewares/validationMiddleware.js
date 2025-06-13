const { ValidationError } = require('../../shared/errors/AppErrors');

/**
 * Validation middleware for request parameters
 */
class ValidationMiddleware {
  /**
   * Validate search trip request parameters
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  static validateSearchTrips(req, res, next) {
    const { origin, destination, sort_by } = req.query;
    const errors = [];

    if (!origin) {
      errors.push('Origin is required');
    } else if (origin.length !== 3) {
      errors.push('Origin must be a 3-letter IATA code');
    }

    if (!destination) {
      errors.push('Destination is required');
    } else if (destination.length !== 3) {
      errors.push('Destination must be a 3-letter IATA code');
    }

    if (sort_by && sort_by !== 'fastest' && sort_by !== 'cheapest') {
      errors.push("Sort_by must be either 'fastest' or 'cheapest'");
    }

    if (errors.length > 0) {
      return next(new ValidationError(errors.join('; ')));
    }

    next();
  }

  /**
   * Validate save trip request body
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  static validateSaveTrip(req, res, next) {
    const { origin, destination, cost, duration, type } = req.body;
    const errors = [];

    if (!origin) {
      errors.push('Origin is required');
    }

    if (!destination) {
      errors.push('Destination is required');
    }

    if (cost === undefined || cost === null) {
      errors.push('Cost is required');
    } else if (typeof cost !== 'number') {
      errors.push('Cost must be a number');
    }

    if (duration === undefined || duration === null) {
      errors.push('Duration is required');
    } else if (typeof duration !== 'number') {
      errors.push('Duration must be a number');
    }

    if (!type) {
      errors.push('Type is required');
    }    if (errors.length > 0) {
      return next(new ValidationError(errors.join('; ')));
    }

    next();
  }
}

module.exports = ValidationMiddleware;
