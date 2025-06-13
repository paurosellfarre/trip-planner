/**
 * Interface for Trip Service
 * Defines methods for fetching and managing trips
 */
class ITripService {
  /**
   * Searches for trips from an origin to a destination
   * @param {string} origin - IATA 3 letter code for origin
   * @param {string} destination - IATA 3 letter code for destination
   * @returns {Promise<Trip[]>} Array of trips
   */
  async searchTrips(origin, destination) {
    throw new Error('Method not implemented');
  }

  /**
   * Gets all supported locations (IATA codes)
   * @returns {Promise<string[]>} Array of supported IATA codes
   */
  async getSupportedLocations() {
    throw new Error('Method not implemented');
  }
}

module.exports = ITripService;
