"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Jest setup file
require("dotenv/config");
// Set test environment
process.env.NODE_ENV = 'test';
process.env.DB_NAME = 'node_js_test_test';
// Mock console methods to reduce test noise
const originalConsole = console;
beforeAll(() => {
    global.console = {
        ...console,
        log: jest.fn(),
        info: jest.fn(),
        warn: jest.fn(),
        error: originalConsole.error, // Keep error for debugging
    };
});
afterAll(() => {
    global.console = originalConsole;
});
// Global test timeout
jest.setTimeout(30000);
//# sourceMappingURL=setup.js.map