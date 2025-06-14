/**
 * Interface for trip validation service
 */
class ITripValidationService {
  /**
   * Register a trip as valid (coming from trusted source)
   * @param {Trip} trip - Trip to register
   * @returns {Promise<void>}
   */
  async registerValidTrip(trip) {
    throw new Error('Method not implemented');
  }

  /**
   * Check if a trip is valid (was previously registered)
   * @param {Trip} trip - Trip to validate
   * @returns {Promise<boolean>} True if trip is valid
   */
  async isValidTrip(trip) {
    throw new Error('Method not implemented');
  }
}

module.exports = ITripValidationService;