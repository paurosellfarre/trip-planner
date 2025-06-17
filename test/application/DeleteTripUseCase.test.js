const DeleteTripUseCase = require('../../src/application/usecases/DeleteTripUseCase');

describe('DeleteTripUseCase', () => {
  let deleteTripUseCase;
  let mockTripRepository;

  beforeEach(() => {
    // Create mock
    mockTripRepository = {
      deleteTrip: jest.fn().mockResolvedValue(true)
    };
    
    deleteTripUseCase = new DeleteTripUseCase(mockTripRepository);
  });

  it('should delete trip successfully', async () => {
    const result = await deleteTripUseCase.execute('123');
    
    expect(mockTripRepository.deleteTrip).toHaveBeenCalledWith('123');
    expect(result).toBe(true);
  });

  it('should throw error when trip id is not provided', async () => {
    await expect(deleteTripUseCase.execute())
      .rejects
      .toThrow('Trip ID is required');
    
    expect(mockTripRepository.deleteTrip).not.toHaveBeenCalled();
  });
});
