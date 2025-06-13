/**
 * Use case for listing all saved trips
 */
class ListTripsUseCase {
  /**
   * @param {ITripRepository} tripRepository - Repository for managing trips
   */
  constructor(tripRepository) {
    this.tripRepository = tripRepository;
  }

  /**
   * List all saved trips
   * @returns {Promise<Trip[]>} Array of all saved trips
   */
  async execute() {
    return this.tripRepository.getAllTrips();
  }
}

module.exports = ListTripsUseCase;
