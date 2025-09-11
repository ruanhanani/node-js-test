"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheManager = exports.CacheManager = void 0;
const redis_1 = require("@config/redis");
class CacheManager {
    constructor(defaultTTL = parseInt(process.env.CACHE_TTL) || 600) {
        this.defaultTTL = defaultTTL;
    }
    /**
     * Get cached data or execute function and cache the result
     */
    async getOrSet(key, fetchFunction, ttl = this.defaultTTL) {
        try {
            // Try to get from cache first
            const cachedData = await redis_1.redisClient.get(key);
            if (cachedData) {
                console.log(`📋 Cache HIT for key: ${key}`);
                return JSON.parse(cachedData);
            }
            console.log(`🔄 Cache MISS for key: ${key}, fetching data...`);
            // Execute function and cache result
            const freshData = await fetchFunction();
            await redis_1.redisClient.set(key, JSON.stringify(freshData), ttl);
            console.log(`💾 Cached data for key: ${key} (TTL: ${ttl}s)`);
            return freshData;
        }
        catch (error) {
            console.error(`❌ Cache error for key ${key}:`, error);
            // If cache fails, still return fresh data
            return await fetchFunction();
        }
    }
    /**
     * Get data from cache
     */
    async get(key) {
        try {
            const data = await redis_1.redisClient.get(key);
            return data ? JSON.parse(data) : null;
        }
        catch (error) {
            console.error(`❌ Error getting cache key ${key}:`, error);
            return null;
        }
    }
    /**
     * Set data in cache
     */
    async set(key, value, ttl = this.defaultTTL) {
        try {
            await redis_1.redisClient.set(key, JSON.stringify(value), ttl);
            return true;
        }
        catch (error) {
            console.error(`❌ Error setting cache key ${key}:`, error);
            return false;
        }
    }
    /**
     * Delete cache key
     */
    async delete(key) {
        try {
            await redis_1.redisClient.del(key);
            return true;
        }
        catch (error) {
            console.error(`❌ Error deleting cache key ${key}:`, error);
            return false;
        }
    }
    /**
     * Delete multiple keys by pattern
     */
    async deletePattern(pattern) {
        try {
            const client = redis_1.redisClient.getClient();
            const keys = await client.keys(pattern);
            if (keys.length === 0) {
                return 0;
            }
            await client.del(...keys);
            return keys.length;
        }
        catch (error) {
            console.error(`❌ Error deleting cache pattern ${pattern}:`, error);
            return 0;
        }
    }
    /**
     * Check if key exists in cache
     */
    async exists(key) {
        try {
            return await redis_1.redisClient.exists(key);
        }
        catch (error) {
            console.error(`❌ Error checking cache key existence ${key}:`, error);
            return false;
        }
    }
    /**
     * Get remaining TTL for a key
     */
    async getTTL(key) {
        try {
            const client = redis_1.redisClient.getClient();
            return await client.ttl(key);
        }
        catch (error) {
            console.error(`❌ Error getting TTL for key ${key}:`, error);
            return -1;
        }
    }
    /**
     * Flush all cache
     */
    async flush() {
        try {
            await redis_1.redisClient.flush();
            return true;
        }
        catch (error) {
            console.error('❌ Error flushing cache:', error);
            return false;
        }
    }
    /**
     * Generate cache key with prefix
     */
    generateKey(prefix, ...parts) {
        return `${prefix}:${parts.join(':')}`;
    }
    /**
     * Cache invalidation patterns
     */
    async invalidateProjectCache(projectId) {
        await this.deletePattern(`project:${projectId}:*`);
        await this.deletePattern(`projects:*`);
        console.log(`🗑️ Invalidated cache for project ${projectId}`);
    }
    async invalidateTaskCache(taskId, projectId) {
        await this.deletePattern(`task:${taskId}:*`);
        await this.deletePattern(`tasks:*`);
        if (projectId) {
            await this.deletePattern(`project:${projectId}:tasks:*`);
        }
        console.log(`🗑️ Invalidated cache for task ${taskId}`);
    }
    async invalidateGitHubCache(projectId, username) {
        if (username) {
            await this.deletePattern(`github:${projectId}:${username}:*`);
        }
        else {
            await this.deletePattern(`github:${projectId}:*`);
        }
        console.log(`🗑️ Invalidated GitHub cache for project ${projectId}${username ? ` and user ${username}` : ''}`);
    }
}
exports.CacheManager = CacheManager;
// Export singleton instance
exports.cacheManager = new CacheManager();
//# sourceMappingURL=cache.js.map