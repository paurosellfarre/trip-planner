const Trip = require('../../domain/entities/trip');

/**
 * Controller for trip-related endpoints
 */
class TripController {
  /**
   * Constructor with dependencies
   * @param {SearchTripsUseCase} searchTripsUseCase - Use case for searching trips
   * @param {SaveTripUseCase} saveTripUseCase - Use case for saving trips
   * @param {ListTripsUseCase} listTripsUseCase - Use case for listing trips
   * @param {DeleteTripUseCase} deleteTripUseCase - Use case for deleting trips
   */
  constructor(
    searchTripsUseCase, 
    saveTripUseCase, 
    listTripsUseCase, 
    deleteTripUseCase
  ) {
    this.searchTripsUseCase = searchTripsUseCase;
    this.saveTripUseCase = saveTripUseCase;
    this.listTripsUseCase = listTripsUseCase;
    this.deleteTripUseCase = deleteTripUseCase;
  }

  /**
   * Search for trips with sorting
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  async searchTrips(req, res, next) {
    try {
      const { origin, destination, sort_by = 'cheapest' } = req.query;
      
      const trips = await this.searchTripsUseCase.execute(
        origin,
        destination,
        sort_by
      );

      res.status(200).json(trips.map(trip => trip.toJSON()));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Save a new trip
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  async saveTrip(req, res, next) {
    try {
      const tripData = req.body;
      const trip = Trip.create(tripData);
      
      const savedTrip = await this.saveTripUseCase.execute(trip);
      
      res.status(201).json(savedTrip.toJSON());
    } catch (error) {
      next(error);
    }
  }

  /**
   * List all saved trips
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  async listTrips(req, res, next) {
    try {
      const trips = await this.listTripsUseCase.execute();
      
      res.status(200).json(trips.map(trip => trip.toJSON()));
    } catch (error) {
      next(error);
    }
  }

  /**
   * Delete a trip by ID
   * @param {Object} req - Express request object
   * @param {Object} res - Express response object
   * @param {Function} next - Express next function
   */
  async deleteTrip(req, res, next) {
    try {
      const { id } = req.params;
      
      const deleted = await this.deleteTripUseCase.execute(id);
      
      if (deleted) {
        res.status(204).end();
      } else {
        const error = new Error('Trip not found');
        error.statusCode = 404;
        throw error;
      }
    } catch (error) {
      next(error);
    }
  }
}

module.exports = TripController;
