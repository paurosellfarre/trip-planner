const SearchTripsUseCase = require('../../src/application/usecases/SearchTripsUseCase');
const Trip = require('../../src/domain/entities/Trip');
const { ValidationError } = require('../../src/shared/errors/AppErrors');

describe('SearchTripsUseCase', () => {
  let searchTripsUseCase;
  let mockTripService;
  let mockCacheService;
  let mockTripValidationService;
  
  const tripData = [
    {
      id: '1',
      origin: 'JFK',
      destination: 'LAX',
      cost: 300,
      duration: 6,
      type: 'flight',
      display_name: 'from JFK to LAX by flight'
    },
    {
      id: '2',
      origin: 'JFK',
      destination: 'LAX',
      cost: 250,
      duration: 8,
      type: 'bus',
      display_name: 'from JFK to LAX by bus'
    }
  ];

  beforeEach(() => {
    // Create mocks
    mockTripService = {
      searchTrips: jest.fn().mockResolvedValue(tripData.map(data => Trip.create(data))),
      isLocationSupported: jest.fn().mockReturnValue(true)
    };
    
    mockCacheService = {
      get: jest.fn().mockResolvedValue(null),
      set: jest.fn().mockResolvedValue(true)
    };
    
    mockTripValidationService = {
      registerValidTrip: jest.fn().mockResolvedValue(undefined)
    };
    
    searchTripsUseCase = new SearchTripsUseCase(
      mockTripService, 
      mockCacheService,
      mockTripValidationService
    );
  });

  it('should return trips sorted by cost when sortBy=cheapest', async () => {
    const trips = await searchTripsUseCase.execute('JFK', 'LAX', 'cheapest');
    
    expect(trips.length).toBe(2);
    expect(trips[0].cost).toBeLessThan(trips[1].cost);
  });

  it('should return trips sorted by duration when sortBy=fastest', async () => {
    const trips = await searchTripsUseCase.execute('JFK', 'LAX', 'fastest');
    
    expect(trips.length).toBe(2);
    expect(trips[0].duration).toBeLessThan(trips[1].duration);
  });

  it('should throw ValidationError when sort parameter is invalid', async () => {
    await expect(searchTripsUseCase.execute('JFK', 'LAX', 'invalid'))
      .rejects
      .toThrow(ValidationError);
  });

  it('should throw ValidationError when origin is not supported', async () => {
    mockTripService.isLocationSupported.mockImplementation(location => 
      location !== 'XXX'
    );
    
    await expect(searchTripsUseCase.execute('XXX', 'LAX', 'cheapest'))
      .rejects
      .toThrow(ValidationError);
  });

  it('should throw ValidationError when destination is not supported', async () => {
    mockTripService.isLocationSupported.mockImplementation(location => 
      location !== 'YYY'
    );
    
    await expect(searchTripsUseCase.execute('JFK', 'YYY', 'cheapest'))
      .rejects
      .toThrow(ValidationError);
  });

  it('should fetch from service and cache when not in cache', async () => {
    const trips = await searchTripsUseCase.execute('JFK', 'LAX', 'cheapest');
    
    expect(mockCacheService.get).toHaveBeenCalledWith('trips:JFK:LAX');
    expect(mockTripService.searchTrips).toHaveBeenCalledWith('JFK', 'LAX');
    expect(mockCacheService.set).toHaveBeenCalled();
    expect(trips.length).toBe(2);
  });

  it('should register each trip as valid', async () => {
    await searchTripsUseCase.execute('JFK', 'LAX', 'cheapest');
    
    expect(mockTripValidationService.registerValidTrip).toHaveBeenCalledTimes(2);
  });
});
