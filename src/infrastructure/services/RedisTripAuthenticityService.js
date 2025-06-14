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
   * Check if a trip hash cache already exists
   * @private
   * @param {string} hash - Trip hash
   * @returns {Promise<boolean>} True if trip hash exists
   */
  async _tripHashExists(hash) {
    const existingTrip = await this.redisClient.get(this._validTripKey(hash));
    return existingTrip !== null;
  }

  /**
   * Register a trip as valid
   * @param {Trip} trip - Trip to register
   * @returns {Promise<void>}
   */
  async registerValidTrip(trip) {
    const hash = this._generateTripHash(trip);

    // Check if the trip hash already exists
    if (await this._tripHashExists(hash)) {
      return; // Trip is already registered
    }

    await this.redisClient.set(
      this._validTripKey(hash),
      JSON.stringify(trip.toJSON()),
      null, // No expiration
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