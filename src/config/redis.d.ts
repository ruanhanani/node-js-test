import Redis from 'ioredis';
declare class RedisClient {
    private client;
    constructor();
    connect(): Promise<void>;
    get(key: string): Promise<string | null>;
    set(key: string, value: string, ttl?: number): Promise<boolean>;
    del(key: string): Promise<boolean>;
    exists(key: string): Promise<boolean>;
    flush(): Promise<boolean>;
    disconnect(): Promise<void>;
    getClient(): Redis;
}
export declare const redisClient: RedisClient;
export {};
//# sourceMappingURL=redis.d.ts.map