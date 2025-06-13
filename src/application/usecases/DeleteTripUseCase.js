/**
 * Use case for deleting a trip
 */
class DeleteTripUseCase {
  /**
   * @param {ITripRepository} tripRepository - Repository for managing trips
   */
  constructor(tripRepository) {
    this.tripRepository = tripRepository;
  }

  /**
   * Deletes a trip by ID
   * @param {string} id - The ID of the trip to delete
   * @returns {Promise<boolean>} True if deleted successfully, false otherwise
   */
  async execute(id) {
    if (!id) {
      throw new Error('Trip ID is required');
    }
    
    return this.tripRepository.deleteTrip(id);
  }
}

module.exports = DeleteTripUseCase;
