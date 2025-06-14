const { ValidationError } = require('../../shared/errors/AppErrors');
const Trip = require('../../domain/entities/Trip');

/**
 * Use case for searching trips
 */
class SearchTripsUseCase {
  /**
   * @param {ITripService} tripService - Service for fetching trips
   * @param {RedisCacheService} cacheService - Cache service for storing results
   * @param {ITripValidationService} tripValidationService - Service for validating trips
   */
  constructor(tripService, cacheService, tripValidationService) {
    this.tripService = tripService;
    this.cacheService = cacheService;
    this.tripValidationService = tripValidationService;
  }

  /**
   * Searches for trips from an origin to a destination with sorting
   * @param {string} origin - IATA code for origin
   * @param {string} destination - IATA code for destination
   * @param {string} sortBy - Sorting strategy ('fastest' or 'cheapest')
   * @returns {Promise<Trip[]>} Sorted array of trips
   * @throws {ValidationError} If parameters are invalid
   */
  async execute(origin, destination, sortBy) {


    // Validate sort parameter
    if (sortBy !== 'fastest' && sortBy !== 'cheapest') {
      throw new ValidationError("Sort parameter must be either 'fastest' or 'cheapest'");
    }
    
    // Validate locations before calling the API
    if (!this.tripService.isLocationSupported(origin)) {
      throw new ValidationError(`Origin ${origin} is not supported`);
    }

    if (!this.tripService.isLocationSupported(destination)) {
      throw new ValidationError(`Destination ${destination} is not supported`);
    }

    // Generate cache key
    const cacheKey = `trips:${origin}:${destination}`;

    // Try to get from cache
    const cachedResults = await this.cacheService.get(cacheKey);
    if (cachedResults) {
      let trips = JSON.parse(cachedResults);

      // Transform cached trips to Trip entities
      trips = trips.map(tripData => Trip.create(tripData));
      return this.sortTrips(trips, sortBy);
    }

    // Fetch from service if not in cache
    const trips = await this.tripService.searchTrips(origin, destination);
    
    // Save to cache
    await this.cacheService.set(cacheKey, JSON.stringify(trips));

    // Register each trip as valid
    for (const trip of trips) {
      await this.tripValidationService.registerValidTrip(trip);
    }

    // Sort and return results
    return this.sortTrips(trips, sortBy);
  }

  /**
   * Sorts trips based on strategy
   * @private
   * @param {Trip[]} trips - Array of trips to sort
   * @param {string} sortBy - Sorting strategy
   * @returns {Trip[]} Sorted array of trips
   */
  sortTrips(trips, sortBy) {
    if (sortBy === 'fastest') {
      return [...trips].sort((a, b) => a.duration - b.duration);
    } else {
      return [...trips].sort((a, b) => a.cost - b.cost);
    }
  }
}

module.exports = SearchTripsUseCase;
