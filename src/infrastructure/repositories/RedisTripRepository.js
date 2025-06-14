const ITripRepository = require('../../domain/repositories/ITripRepository');
const Trip = require('../../domain/entities/trip');
const { v4: uuidv4 } = require('uuid');

/**
 * Redis implementation of the Trip Repository
 */
class RedisTripRepository extends ITripRepository {
  /**
   * @param {RedisCacheService} redisClient - Redis client for data storage
   */
  constructor(redisClient) {
    super();
    this.redisClient = redisClient;
    this.tripPrefix = 'trip:';
    this.tripListKey = 'trips:all';
  }

  /**
   * Generate a key for a trip
   * @private
   * @param {string} id - Trip ID
   * @returns {string} Redis key
   */
  _tripKey(id) {
    return `${this.tripPrefix}${id}`;
  }

  /**
   * Save a trip to the repository
   * @param {Trip} trip - Trip to save
   * @returns {Promise<Trip>} Saved trip
   */
  async saveTrip(trip) {
    // Generate ID if not provided
    if (!trip.id) {
      trip.id = uuidv4();
    }

    // Save trip data
    await this.redisClient.set(
      this._tripKey(trip.id), 
      JSON.stringify(trip.toJSON()),
      null, // No expiration
    );

    // Add to trip list
    await this.redisClient.client.sAdd(this.tripListKey, trip.id);

    return trip;
  }

  /**
   * Get all saved trips
   * @returns {Promise<Trip[]>} Array of trips
   */
  async getAllTrips() {
    try {
      // Get all trip IDs
      const tripIds = await this.redisClient.client.sMembers(this.tripListKey);

      if (!tripIds || tripIds.length === 0) {
        return [];
      }

      // Get all trips in parallel
      const tripPromises = tripIds.map(id => this.getTripById(id));
      const trips = await Promise.all(tripPromises);
      
      // Filter out any null values (deleted trips)
      return trips.filter(trip => trip !== null);
    } catch (error) {
      console.error('Error getting all trips:', error);
      return [];
    }
  }

  /**
   * Get a trip by ID
   * @param {string} id - Trip ID
   * @returns {Promise<Trip|null>} Trip if found, null otherwise
   */
  async getTripById(id) {
    try {
      const tripData = await this.redisClient.get(this._tripKey(id));
      
      if (!tripData) {
        return null;
      }

      const parsedData = JSON.parse(tripData);
      return Trip.create(parsedData);
    } catch (error) {
      console.error(`Error getting trip ${id}:`, error);
      return null;
    }
  }

  /**
   * Delete a trip by ID
   * @param {string} id - Trip ID to delete
   * @returns {Promise<boolean>} True if deleted, false otherwise
   */
  async deleteTrip(id) {
    try {
      // Check if trip exists
      const exists = await this.redisClient.get(this._tripKey(id));
      
      if (!exists) {
        return false;
      }

      // Delete trip and remove from list
      await this.redisClient.delete(this._tripKey(id));
      await this.redisClient.client.sRem(this.tripListKey, id);
      
      return true;
    } catch (error) {
      console.error(`Error deleting trip ${id}:`, error);
      return false;
    }
  }
}

module.exports = RedisTripRepository;
