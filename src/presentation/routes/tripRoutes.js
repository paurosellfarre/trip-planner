const express = require('express');
const ValidationMiddleware = require('../middlewares/validationMiddleware');
const { createRateLimiter } = require('../middlewares/rateLimiter');

// Import use cases
const SearchTripsUseCase = require('../../application/usecases/SearchTripsUseCase');
const SaveTripUseCase = require('../../application/usecases/SaveTripUseCase');
const ListTripsUseCase = require('../../application/usecases/ListTripsUseCase');
const DeleteTripUseCase = require('../../application/usecases/DeleteTripUseCase');

// Import controller
const TripController = require('../controllers/TripController');

// Import services and repositories
const ExternalTripAPIService = require('../../infrastructure/services/ExternalTripAPIService');
const RedisTripAuthenticityService = require('../../infrastructure/services/RedisTripAuthenticityService');
const RedisCacheService = require('../../infrastructure/services/RedisCacheService');
const RedisTripRepository = require('../../infrastructure/repositories/RedisTripRepository');

// Create instances
const redisService = new RedisCacheService();
const externalpTripService = new ExternalTripAPIService();
const tripValidationService = new RedisTripAuthenticityService(redisService);
const tripRepository = new RedisTripRepository(redisService); // Correct. Infra reopsitory can inject infra services

// Create use cases
const searchTripsUseCase = new SearchTripsUseCase(externalpTripService, redisService, tripValidationService);
const saveTripUseCase = new SaveTripUseCase(tripRepository, tripValidationService);
const listTripsUseCase = new ListTripsUseCase(tripRepository);
const deleteTripUseCase = new DeleteTripUseCase(tripRepository);

// Create controller
const tripController = new TripController(
  searchTripsUseCase,
  saveTripUseCase,
  listTripsUseCase,
  deleteTripUseCase
);

// Create rate limiters
const rateLimiterMiddleware = createRateLimiter({
  windowMs: 60 * 1000, // 1 minute window
  max: 30 // 30 requests per minute
});

// Create router
const router = express.Router();

/**
 * @swagger
 * /api/trips/search:
 *   get:
 *     summary: Search for trips from origin to destination
 *     description: Search for trips with sorting options (fastest or cheapest)
 *     parameters:
 *       - in: query
 *         name: origin
 *         required: true
 *         schema:
 *           type: string
 *         description: IATA 3-letter code for origin
 *       - in: query
 *         name: destination
 *         required: true
 *         schema:
 *           type: string
 *         description: IATA 3-letter code for destination
 *       - in: query
 *         name: sort_by
 *         schema:
 *           type: string
 *           enum: [fastest, cheapest]
 *           default: cheapest
 *         description: Sorting strategy
 *     responses:
 *       200:
 *         description: List of trips
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trip'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/search',
  rateLimiterMiddleware,
  ValidationMiddleware.validateSearchTrips,
  (req, res, next) => tripController.searchTrips(req, res, next)
);

/**
 * @swagger
 * /api/trips:
 *   post:
 *     summary: Save a trip
 *     description: Add a new trip to the saved trips list
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Trip'
 *     responses:
 *       201:
 *         description: Trip saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Trip'
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.post(
  '/',
  rateLimiterMiddleware,
  ValidationMiddleware.validateSaveTrip,
  (req, res, next) => tripController.saveTrip(req, res, next)
);

/**
 * @swagger
 * /api/trips:
 *   get:
 *     summary: List all saved trips
 *     description: Get a list of all saved trips
 *     responses:
 *       200:
 *         description: List of saved trips
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Trip'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.get(
  '/',
  rateLimiterMiddleware,
  (req, res, next) => tripController.listTrips(req, res, next)
);

/**
 * @swagger
 * /api/trips/{id}:
 *   delete:
 *     summary: Delete a trip
 *     description: Delete a trip by its ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Trip ID
 *     responses:
 *       204:
 *         description: Trip deleted successfully
 *       404:
 *         description: Trip not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
router.delete(
  '/:id',
  rateLimiterMiddleware,
  (req, res, next) => tripController.deleteTrip(req, res, next)
);

module.exports = router;
