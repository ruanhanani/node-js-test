"use strict";
/**
 * Mock Cache Manager - No Redis dependency
 * This is a simple in-memory cache for development/testing
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.cacheManager = exports.MockCacheManager = void 0;
class MockCacheManager {
    constructor(defaultTTL = 600) {
        this.cache = new Map();
        this.defaultTTL = defaultTTL;
        // Clean expired items every minute
        setInterval(() => {
            this.cleanExpired();
        }, 60000);
    }
    /**
     * Get cached data or execute function and cache the result
     */
    async getOrSet(key, fetchFunction, ttl = this.defaultTTL) {
        // Check if item exists and is not expired
        const cachedItem = this.cache.get(key);
        if (cachedItem && cachedItem.expires > Date.now()) {
            console.log(`📋 Cache HIT for key: ${key}`);
            return cachedItem.value;
        }
        console.log(`🔄 Cache MISS for key: ${key}, fetching data...`);
        // Execute function and cache result
        const freshData = await fetchFunction();
        this.cache.set(key, {
            value: freshData,
            expires: Date.now() + (ttl * 1000)
        });
        console.log(`💾 Cached data for key: ${key} (TTL: ${ttl}s)`);
        return freshData;
    }
    /**
     * Get data from cache
     */
    async get(key) {
        const cachedItem = this.cache.get(key);
        if (cachedItem && cachedItem.expires > Date.now()) {
            return cachedItem.value;
        }
        return null;
    }
    /**
     * Set data in cache
     */
    async set(key, value, ttl = this.defaultTTL) {
        this.cache.set(key, {
            value,
            expires: Date.now() + (ttl * 1000)
        });
        return true;
    }
    /**
     * Delete cache key
     */
    async delete(key) {
        return this.cache.delete(key);
    }
    /**
     * Delete multiple keys by pattern
     */
    async deletePattern(pattern) {
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        let deletedCount = 0;
        for (const key of this.cache.keys()) {
            if (regex.test(key)) {
                this.cache.delete(key);
                deletedCount++;
            }
        }
        return deletedCount;
    }
    /**
     * Check if key exists in cache
     */
    async exists(key) {
        const cachedItem = this.cache.get(key);
        return cachedItem !== undefined && cachedItem.expires > Date.now();
    }
    /**
     * Get remaining TTL for a key (in seconds)
     */
    async getTTL(key) {
        const cachedItem = this.cache.get(key);
        if (!cachedItem)
            return -2; // Key doesn't exist
        if (cachedItem.expires <= Date.now())
            return -2; // Key expired
        return Math.ceil((cachedItem.expires - Date.now()) / 1000);
    }
    /**
     * Flush all cache
     */
    async flush() {
        this.cache.clear();
        return true;
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
    /**
     * Clean expired items from cache
     */
    cleanExpired() {
        const now = Date.now();
        let cleanedCount = 0;
        for (const [key, item] of this.cache.entries()) {
            if (item.expires <= now) {
                this.cache.delete(key);
                cleanedCount++;
            }
        }
        if (cleanedCount > 0) {
            console.log(`🧹 Cleaned ${cleanedCount} expired cache items`);
        }
    }
    /**
     * Get cache statistics
     */
    getStats() {
        const now = Date.now();
        let expiredCount = 0;
        for (const item of this.cache.values()) {
            if (item.expires <= now) {
                expiredCount++;
            }
        }
        return {
            totalItems: this.cache.size,
            expiredItems: expiredCount,
            memoryUsage: `${Math.round(this.cache.size * 100 / 1024)} KB (approx)`
        };
    }
}
exports.MockCacheManager = MockCacheManager;
// Export singleton instance
exports.cacheManager = new MockCacheManager();
//# sourceMappingURL=cache-mock.js.map