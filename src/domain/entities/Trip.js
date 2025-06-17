/**
 * Trip entity representing a trip from an origin to a destination
 */
class Trip {
  constructor(data) {
    this.id = data.id;
    this.origin = data.origin;
    this.destination = data.destination;
    this.cost = data.cost;
    this.duration = data.duration;
    this.type = data.type;
    this.display_name = data.display_name;
  }

  /**
   * Validates if the trip data is valid
   * @returns {boolean} True if valid, false otherwise
   */
  isValid() {
    return (
      typeof this.origin === 'string' &&
      typeof this.destination === 'string' &&
      typeof this.cost === 'number' &&
      typeof this.duration === 'number' &&
      typeof this.type === 'string' &&
      typeof this.id === 'string' &&
      typeof this.display_name === 'string'
    );
  }

  /**
   * Creates a trip object from raw data
   * @param {Object} data - Raw trip data
   * @returns {Trip} A new Trip instance
   */
  static create(data) {
    return new Trip({
      id: data.id,
      origin: data.origin,
      destination: data.destination, 
      cost: data.cost,
      duration: data.duration,
      type: data.type,
      display_name: data.display_name
    });
  }

  /**
   * Converts the trip to a plain object
   * @returns {Object} Plain object representing the trip
   */
  toJSON() {
    return {
      id: this.id,
      origin: this.origin,
      destination: this.destination,
      cost: this.cost,
      duration: this.duration,
      type: this.type,
      display_name: this.display_name
    };
  }
}

module.exports = Trip;
