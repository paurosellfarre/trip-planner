const ListTripsUseCase = require('../../src/application/usecases/ListTripsUseCase');
const Trip = require('../../src/domain/entities/Trip');

describe('ListTripsUseCase', () => {
  let listTripsUseCase;
  let mockTripRepository;
  
  const tripsData = [
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
      origin: 'SFO',
      destination: 'NYC',
      cost: 400,
      duration: 5,
      type: 'flight',
      display_name: 'from SFO to NYC by flight'
    }
  ];

  beforeEach(() => {
    // Create mock
    mockTripRepository = {
      getAllTrips: jest.fn().mockResolvedValue(tripsData.map(data => Trip.create(data)))
    };
    
    listTripsUseCase = new ListTripsUseCase(mockTripRepository);
  });

  it('should return all trips from repository', async () => {
    const trips = await listTripsUseCase.execute();
    
    expect(mockTripRepository.getAllTrips).toHaveBeenCalled();
    expect(trips.length).toBe(2);
    expect(trips[0]).toBeInstanceOf(Trip);
    expect(trips[1]).toBeInstanceOf(Trip);
    expect(trips[0].id).toBe('1');
    expect(trips[1].id).toBe('2');
  });
});
