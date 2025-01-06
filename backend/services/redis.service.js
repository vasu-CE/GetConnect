const Redis = require('ioredis');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

let redisClient;

try {
    // Initialize Redis client
    redisClient = new Redis({
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD,
    });

    // Handle Redis connection events
    redisClient.on('connect', () => {
        console.log('Connected to Redis');
    });

    redisClient.on('error', (err) => {
        console.error('Redis connection error:', err);
    });

} catch (error) {
    console.error('Error initializing Redis:', error);
}

module.exports = redisClient;
