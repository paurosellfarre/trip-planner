const axios = require('axios');
const Trip = require('../../domain/entities/trip');
const ITripService = require('../../domain/services/ITripService');
const logger = require('../../shared/utils/logger');

/**
 * Implementation of ITripService that uses the external Trip API
 */
class ExternalTripAPIService extends ITripService {
  constructor() {
    super();
    this.apiUrl = process.env.TRIP_API_URL;
    this.apiKey = process.env.TRIP_API_KEY;

    // List of supported IATA codes
    this.supportedLocations = [
      "ATL", "PEK", "LAX", "DXB", "HND", "ORD", "LHR", "PVG", "CDG", "DFW",
      "AMS", "FRA", "IST", "CAN", "JFK", "SIN", "DEN", "ICN", "BKK", "SFO",
      "LAS", "CLT", "MIA", "KUL", "SEA", "MUC", "EWR", "MAD", "HKG", "MCO",
      "PHX", "IAH", "SYD", "MEL", "GRU", "YYZ", "LGW", "BCN", "MAN", "BOM",
      "DEL", "ZRH", "SVO", "DME", "JNB", "ARN", "OSL", "CPH", "HEL", "VIE"
    ];
  }

  /**
   * Get HTTP headers for API requests
   * @private
   * @returns {Object} HTTP headers
   */
  _getHeaders() {
    return {
      'x-api-key': this.apiKey
    };
  }

  /**
   * Search for trips from origin to destination
   * @param {string} origin - IATA code for origin
   * @param {string} destination - IATA code for destination
   * @returns {Promise<Trip[]>} Array of Trip entities
   * @throws {Error} If the request fails or parameters are invalid
   */
  async searchTrips(origin, destination) {
    if (!this.apiKey) {
      throw new Error('API key is missing');
    }

    if (!origin || !destination) {
      throw new Error('Origin and destination are required');
    }

    try {
      const response = await axios.get(this.apiUrl, {
        headers: this._getHeaders(),
        params: {
          origin: origin.toUpperCase(),
          destination: destination.toUpperCase()
        }
      });

      if (!response.data || !Array.isArray(response.data)) {
        throw new Error('Invalid response from API');
      }

      // Filter trips by origin and destination
      const matchingTrips = response.data.filter(trip => 
        trip.origin === origin && trip.destination === destination
      );

      // Convert to domain entities
      return matchingTrips.map(tripData => Trip.create(tripData)); 

    } catch (error) {
      logger.error('Error searching trips:', { 
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      throw new Error(`Failed to search trips: ${error.message}`);
    }
  }

  /**
   * Check if a location is supported
   * @param {string} location - IATA code to check
   * @returns {boolean} True if supported
   */
  isLocationSupported(location) {
    return this.supportedLocations.includes(location.toUpperCase());
  }
}

module.exports = ExternalTripAPIService;
