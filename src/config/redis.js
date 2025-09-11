"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.redisClient = void 0;
const ioredis_1 = __importDefault(require("ioredis"));
class RedisClient {
    constructor() {
        this.client = new ioredis_1.default({
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT) || 6379,
            password: process.env.REDIS_PASSWORD || undefined,
            maxRetriesPerRequest: 3,
            lazyConnect: true,
        });
        this.client.on('connect', () => {
            console.log('✅ Redis connection established successfully.');
        });
        this.client.on('error', (error) => {
            console.error('❌ Redis connection error:', error);
        });
        this.client.on('close', () => {
            console.log('🔌 Redis connection closed.');
        });
    }
    async connect() {
        try {
            await this.client.connect();
        }
        catch (error) {
            console.error('❌ Failed to connect to Redis:', error);
        }
    }
    async get(key) {
        try {
            return await this.client.get(key);
        }
        catch (error) {
            console.error(`❌ Error getting key ${key}:`, error);
            return null;
        }
    }
    async set(key, value, ttl) {
        try {
            if (ttl) {
                await this.client.setex(key, ttl, value);
            }
            else {
                await this.client.set(key, value);
            }
            return true;
        }
        catch (error) {
            console.error(`❌ Error setting key ${key}:`, error);
            return false;
        }
    }
    async del(key) {
        try {
            await this.client.del(key);
            return true;
        }
        catch (error) {
            console.error(`❌ Error deleting key ${key}:`, error);
            return false;
        }
    }
    async exists(key) {
        try {
            const result = await this.client.exists(key);
            return result === 1;
        }
        catch (error) {
            console.error(`❌ Error checking if key ${key} exists:`, error);
            return false;
        }
    }
    async flush() {
        try {
            await this.client.flushall();
            return true;
        }
        catch (error) {
            console.error('❌ Error flushing Redis:', error);
            return false;
        }
    }
    async disconnect() {
        await this.client.quit();
    }
    getClient() {
        return this.client;
    }
}
exports.redisClient = new RedisClient();
//# sourceMappingURL=redis.js.map