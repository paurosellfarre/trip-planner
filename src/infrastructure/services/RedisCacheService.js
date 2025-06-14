const redis = require('redis');
const config = require('../../shared/config/config');
const logger = require('../../shared/utils/logger');

/**
 * Redis cache implementation for caching API responses
 */
class RedisCacheService {
  constructor() {
    this.client = null;
    this.ttl = config.redis.ttl;
    this.initialize();
  }

  /**
   * Initialize the Redis client connection
   */
  async initialize() {
    try {
      const { host, port, password } = config.redis;
      
      const redisUrl = password 
        ? `redis://:${password}@${host}:${port}` 
        : `redis://${host}:${port}`;
      
      this.client = redis.createClient({
        url: redisUrl
      });

      this.client.on('error', (error) => {
        logger.error('Redis error:', { message: error.message });
      });

      this.client.on('connect', () => {
        logger.info('Connected to Redis');
      });

      await this.client.connect();    } catch (error) {
      logger.warn('Redis connection error:', { message: error.message });
      logger.info('Continuing without cache');
    }
  }

  /**
   * Get a value from the cache
   * @param {string} key - The cache key
   * @returns {Promise<string|null>} The cached value or null
   */
  async get(key) {
    if (!this.client?.isReady) return null;
    
    try {
      const result = await this.client.get(key);
      if (result) {
        logger.debug(`Cache hit for key: ${key}`);
      }
      return result;
    } catch (error) {
      logger.error('Redis get error:', { message: error.message });
      return null;
    }
  }

  /**
   * Set a value in the cache
   * @param {string} key - The cache key
   * @param {string} value - The value to cache
   * @param {number} [ttl] - Time to live in seconds (optional)
   * @returns {Promise<boolean>} Success indicator
   */
  async set(key, value, ttl = this.ttl) {
    if (!this.client?.isReady) return false;
    
    try {
      await this.client.set(key, value, { EX: ttl });
      logger.debug(`Cache set for key: ${key} with TTL: ${ttl}s`);
      return true;
    } catch (error) {
      logger.error('Redis set error:', { message: error.message });
      return false;
    }
  }

  /**
   * Delete a value from the cache
   * @param {string} key - The cache key
   * @returns {Promise<boolean>} Success indicator
   */  
  async delete(key) {
    if (!this.client?.isReady) return false;
    
    try {
      await this.client.del(key);
      logger.debug(`Cache deleted for key: ${key}`);
      return true;
    } catch (error) {
      logger.error('Redis delete error:', { message: error.message });
      return false;
    }
  }

  /**
   * Close the Redis connection
   */
  async close() {
    if (this.client?.isReady) {
      await this.client.quit();
      logger.info('Redis connection closed');
    }
  }
}

module.exports = RedisCacheService;
