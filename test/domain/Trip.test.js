const Trip = require('../../src/domain/entities/Trip');

describe('Trip Entity', () => {
  const validTripData = {
    id: '123',
    origin: 'JFK',
    destination: 'LAX',
    cost: 300,
    duration: 6,
    type: 'flight',
    display_name: 'from JFK to LAX by flight'
  };

  describe('constructor', () => {
    it('should create a Trip with all the provided properties', () => {
      const trip = new Trip(validTripData);
      
      expect(trip.id).toBe(validTripData.id);
      expect(trip.origin).toBe(validTripData.origin);
      expect(trip.destination).toBe(validTripData.destination);
      expect(trip.cost).toBe(validTripData.cost);
      expect(trip.duration).toBe(validTripData.duration);
      expect(trip.type).toBe(validTripData.type);
      expect(trip.display_name).toBe(validTripData.display_name);
    });
  });

  describe('isValid', () => {
    it('should return true for a valid trip', () => {
      const trip = new Trip(validTripData);
      expect(trip.isValid()).toBe(true);
    });

    it('should return false when origin is missing', () => {
      const trip = new Trip({...validTripData, origin: null});
      expect(trip.isValid()).toBe(false);
    });

    it('should return false when destination is missing', () => {
      const trip = new Trip({...validTripData, destination: undefined});
      expect(trip.isValid()).toBe(false);
    });

    it('should return false when cost is not a number', () => {
      const trip = new Trip({...validTripData, cost: '300'});
      expect(trip.isValid()).toBe(false);
    });

    it('should return false when duration is not a number', () => {
      const trip = new Trip({...validTripData, duration: '6'});
      expect(trip.isValid()).toBe(false);
    });

    it('should return false when type is missing', () => {
      const trip = new Trip({...validTripData, type: null});
      expect(trip.isValid()).toBe(false);
    });

    it('should return false when id is missing', () => {
      const trip = new Trip({...validTripData, id: null});
      expect(trip.isValid()).toBe(false);
    });
  });

  describe('create', () => {
    it('should create a valid Trip from raw data', () => {
      const trip = Trip.create(validTripData);
      
      expect(trip).toBeInstanceOf(Trip);
      expect(trip.isValid()).toBe(true);
      expect(trip.id).toBe(validTripData.id);
    });
  });

  describe('toJSON', () => {
    it('should convert a Trip to a plain object with all properties', () => {
      const trip = new Trip(validTripData);
      const json = trip.toJSON();
      
      expect(json).toEqual(validTripData);
      expect(json.constructor).not.toBe(Trip);
    });
  });
});
