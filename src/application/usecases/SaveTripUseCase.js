const { ValidationError } = require('../../shared/errors/AppErrors');

/**
 * Use case for saving a trip
 */
class SaveTripUseCase {
  /**
   * @param {ITripRepository} tripRepository - Repository for managing trips
   * @param {ITripValidationService} tripValidationService - Service for validating trips
   */
  constructor(tripRepository, tripValidationService) {
    this.tripRepository = tripRepository;
    this.tripValidationService = tripValidationService;
  }

  /**
   * Saves a trip
   * @param {Trip} trip - The trip entity to save
   * @returns {Promise<Trip>} The saved trip
   * @throws {ValidationError} If trip data is invalid or not from trusted source
   */
  async execute(trip) {
    if (!trip.isValid()) {
      throw new ValidationError('Invalid trip data');
    }

    // Verify that this trip was previously fetched from external API
    const isValid = await this.tripValidationService.isValidTrip(trip);
    if (!isValid) {
      throw new ValidationError('Trip not found in trusted source. Only trips from the search results can be saved.');
    }

    return this.tripRepository.saveTrip(trip);
  }
}

module.exports = SaveTripUseCase;