export declare class CacheManager {
    private defaultTTL;
    constructor(defaultTTL?: number);
    /**
     * Get cached data or execute function and cache the result
     */
    getOrSet<T>(key: string, fetchFunction: () => Promise<T>, ttl?: number): Promise<T>;
    /**
     * Get data from cache
     */
    get<T>(key: string): Promise<T | null>;
    /**
     * Set data in cache
     */
    set(key: string, value: any, ttl?: number): Promise<boolean>;
    /**
     * Delete cache key
     */
    delete(key: string): Promise<boolean>;
    /**
     * Delete multiple keys by pattern
     */
    deletePattern(pattern: string): Promise<number>;
    /**
     * Check if key exists in cache
     */
    exists(key: string): Promise<boolean>;
    /**
     * Get remaining TTL for a key
     */
    getTTL(key: string): Promise<number>;
    /**
     * Flush all cache
     */
    flush(): Promise<boolean>;
    /**
     * Generate cache key with prefix
     */
    generateKey(prefix: string, ...parts: (string | number)[]): string;
    /**
     * Cache invalidation patterns
     */
    invalidateProjectCache(projectId: number): Promise<void>;
    invalidateTaskCache(taskId: number, projectId?: number): Promise<void>;
    invalidateGitHubCache(projectId: number, username?: string): Promise<void>;
}
export declare const cacheManager: CacheManager;
//# sourceMappingURL=cache.d.ts.map