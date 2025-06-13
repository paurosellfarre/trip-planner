/**
 * Use case for saving a trip
 */
class SaveTripUseCase {
  /**
   * @param {ITripRepository} tripRepository - Repository for managing trips
   */
  constructor(tripRepository) {
    this.tripRepository = tripRepository;
  }

  /**
   * Saves a trip
   * @param {Trip} trip - The trip entity to save
   * @returns {Promise<Trip>} The saved trip
   * @throws {Error} If trip data is invalid
   */
  async execute(trip) {
    if (!trip.isValid()) {
      throw new Error('Invalid trip data');
    }
//TODO: use the service to search for the trip hash on Redis, to ensure the trip "existed" on 3rd party service
    return this.tripRepository.saveTrip(trip);
  }
}

module.exports = SaveTripUseCase;
