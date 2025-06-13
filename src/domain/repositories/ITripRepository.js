/**
 * Interface for Trip Repository
 * Defines methods for managing trips
 */
class ITripRepository {
  /**
   * Saves a trip to the repository
   * @param {Trip} trip - The trip to save
   * @returns {Promise<Trip>} The saved trip
   */
  async saveTrip(trip) {
    throw new Error('Method not implemented');
  }

  /**
   * Gets all saved trips
   * @returns {Promise<Trip[]>} Array of saved trips
   */
  async getAllTrips() {
    throw new Error('Method not implemented');
  }

  /**
   * Gets a trip by its ID
   * @param {string} id - The trip ID
   * @returns {Promise<Trip|null>} The trip if found, null otherwise
   */
  async getTripById(id) {
    throw new Error('Method not implemented');
  }

  /**
   * Deletes a trip by its ID
   * @param {string} id - The trip ID to delete
   * @returns {Promise<boolean>} True if deleted, false otherwise
   */
  async deleteTrip(id) {
    throw new Error('Method not implemented');
  }
}

module.exports = ITripRepository;
