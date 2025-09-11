import 'dotenv/config';
import express from 'express';
declare class App {
    app: express.Application;
    private port;
    constructor();
    private initializeMiddlewares;
    private initializeRoutes;
    private initializeErrorHandling;
    start(): Promise<void>;
    getApp(): express.Application;
}
declare const app: App;
export default app;
//# sourceMappingURL=index.d.ts.map