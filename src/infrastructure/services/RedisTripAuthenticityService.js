const crypto = require('crypto');
const ITripAuthenticityService = require('../../domain/services/ITripAuthenticityService');

/**
 * Redis implementation of trip validation service
 */
class RedisTripAuthenticityService extends ITripAuthenticityService {
  /**
   * @param {RedisCacheService} redisClient - Redis client
   */
  constructor(redisClient) {
    super();
    this.redisClient = redisClient;
    this.validTripsPrefix = 'valid-trip:';
    this.validTripsTTL = 86400; // 24 hours
  }

  /**
   * Generate a unique hash for a trip based on its content
   * @private
   * @param {Trip} trip - Trip to hash
   * @returns {string} Hash value
   */
  _generateTripHash(trip) {
    // Create a string with critical trip properties
    const tripData = `${trip.origin}:${trip.destination}:${trip.cost}:${trip.duration}:${trip.type}:${trip.id}`;
    // Create SHA-256 hash of the string
    return crypto.createHash('sha256').update(tripData).digest('hex');
  }

  /**
   * Generate Redis key for a trip hash
   * @private
   * @param {string} hash - Trip hash
   * @returns {string} Redis key
   */
  _validTripKey(hash) {
    return `${this.validTripsPrefix}${hash}`;
  }

  /**
   * Register a trip as valid
   * @param {Trip} trip - Trip to register
   * @returns {Promise<void>}
   */
  async registerValidTrip(trip) {
    const hash = this._generateTripHash(trip);
    await this.redisClient.set(
      this._validTripKey(hash),
      JSON.stringify(trip.toJSON()),
      this.validTripsTTL
    );
  }

  /**
   * Check if a trip is valid
   * @param {Trip} trip - Trip to validate
   * @returns {Promise<boolean>} True if trip is valid
   */
  async isValidTrip(trip) {
    const hash = this._generateTripHash(trip);
    const existingTrip = await this.redisClient.get(this._validTripKey(hash));
    return existingTrip !== null;
  }
}

module.exports = RedisTripAuthenticityService;