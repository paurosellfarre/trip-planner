const SaveTripUseCase = require('../../src/application/usecases/SaveTripUseCase');
const Trip = require('../../src/domain/entities/Trip');
const { ValidationError } = require('../../src/shared/errors/AppErrors');

describe('SaveTripUseCase', () => {
  let saveTripUseCase;
  let mockTripRepository;
  let mockTripValidationService;
  
  const validTripData = {
    id: '123',
    origin: 'JFK',
    destination: 'LAX',
    cost: 300,
    duration: 6,
    type: 'flight',
    display_name: 'from JFK to LAX by flight'
  };

  beforeEach(() => {
    // Create mocks
    mockTripRepository = {
      saveTrip: jest.fn().mockImplementation(trip => Promise.resolve(trip))
    };
    
    mockTripValidationService = {
      isValidTrip: jest.fn().mockImplementation(() => Promise.resolve(true))
    };
    
    saveTripUseCase = new SaveTripUseCase(mockTripRepository, mockTripValidationService);
  });

  it('should save a valid trip successfully', async () => {
    const trip = Trip.create(validTripData);
    
    const savedTrip = await saveTripUseCase.execute(trip);
    
    expect(mockTripValidationService.isValidTrip).toHaveBeenCalledWith(trip);
    expect(mockTripRepository.saveTrip).toHaveBeenCalledWith(trip);
    expect(savedTrip).toBe(trip);
  });

  it('should throw ValidationError if trip is invalid', async () => {
    const invalidTrip = new Trip({...validTripData, origin: null});
    
    await expect(saveTripUseCase.execute(invalidTrip))
      .rejects
      .toThrow(ValidationError);
    
    expect(mockTripValidationService.isValidTrip).not.toHaveBeenCalled();
    expect(mockTripRepository.saveTrip).not.toHaveBeenCalled();
  });

  it('should throw ValidationError if trip is not from trusted source', async () => {
    const trip = Trip.create(validTripData);
    mockTripValidationService.isValidTrip.mockResolvedValue(false);
    
    await expect(saveTripUseCase.execute(trip))
      .rejects
      .toThrow(ValidationError);
    
    expect(mockTripValidationService.isValidTrip).toHaveBeenCalledWith(trip);
    expect(mockTripRepository.saveTrip).not.toHaveBeenCalled();
  });
});
