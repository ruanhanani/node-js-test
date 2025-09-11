"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.corsMiddleware = exports.rateLimit = exports.requestLogger = exports.notFoundHandler = exports.globalErrorHandler = exports.asyncHandler = exports.InternalServerError = exports.ConflictError = exports.ForbiddenError = exports.UnauthorizedError = exports.BadRequestError = exports.NotFoundError = exports.ApiError = void 0;
const sequelize_1 = require("sequelize");
class ApiError extends Error {
    constructor(message, statusCode = 500, isOperational = true) {
        super(message);
        this.statusCode = statusCode;
        this.isOperational = isOperational;
        Error.captureStackTrace(this, this.constructor);
    }
}
exports.ApiError = ApiError;
// Create specific error types
class NotFoundError extends ApiError {
    constructor(message = 'Recurso não encontrado') {
        super(message, 404);
    }
}
exports.NotFoundError = NotFoundError;
class BadRequestError extends ApiError {
    constructor(message = 'Requisição inválida') {
        super(message, 400);
    }
}
exports.BadRequestError = BadRequestError;
class UnauthorizedError extends ApiError {
    constructor(message = 'Não autorizado') {
        super(message, 401);
    }
}
exports.UnauthorizedError = UnauthorizedError;
class ForbiddenError extends ApiError {
    constructor(message = 'Proibido') {
        super(message, 403);
    }
}
exports.ForbiddenError = ForbiddenError;
class ConflictError extends ApiError {
    constructor(message = 'Conflito de dados') {
        super(message, 409);
    }
}
exports.ConflictError = ConflictError;
class InternalServerError extends ApiError {
    constructor(message = 'Erro interno do servidor') {
        super(message, 500);
    }
}
exports.InternalServerError = InternalServerError;
// Async error wrapper
const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
exports.asyncHandler = asyncHandler;
// Global error handler middleware
const globalErrorHandler = (error, req, res, next) => {
    let { statusCode = 500, message } = error;
    // Handle different types of errors
    if (error instanceof sequelize_1.ValidationError) {
        statusCode = 400;
        const errors = error.errors.map(err => ({
            field: err.path,
            message: err.message,
            value: err.value,
        }));
        res.status(statusCode).json({
            success: false,
            message: 'Erro de validação',
            errors,
            ...(process.env.NODE_ENV === 'development' && { stack: error.stack }),
        });
        return;
    }
    // Handle Sequelize database errors
    if (error.name === 'SequelizeDatabaseError') {
        statusCode = 500;
        message = 'Erro de banco de dados';
        if (process.env.NODE_ENV === 'development') {
            message += `: ${error.message}`;
        }
    }
    // Handle Sequelize unique constraint errors
    if (error.name === 'SequelizeUniqueConstraintError') {
        statusCode = 409;
        message = 'Recurso já existe';
    }
    // Handle Sequelize foreign key constraint errors
    if (error.name === 'SequelizeForeignKeyConstraintError') {
        statusCode = 400;
        message = 'Referência inválida';
    }
    // Handle JSON parsing errors
    if (error.name === 'SyntaxError' && 'body' in error) {
        statusCode = 400;
        message = 'JSON inválido na requisição';
    }
    // Handle JWT errors
    if (error.name === 'JsonWebTokenError') {
        statusCode = 401;
        message = 'Token inválido';
    }
    if (error.name === 'TokenExpiredError') {
        statusCode = 401;
        message = 'Token expirado';
    }
    // Log error for debugging
    console.error('🚨 Error:', {
        message: error.message,
        statusCode,
        stack: error.stack,
        url: req.url,
        method: req.method,
        ip: req.ip,
        userAgent: req.get('User-Agent'),
        timestamp: new Date().toISOString(),
    });
    // Send error response
    const errorResponse = {
        success: false,
        message,
        timestamp: new Date().toISOString(),
        path: req.url,
        method: req.method,
    };
    // Include stack trace in development
    if (process.env.NODE_ENV === 'development') {
        errorResponse.stack = error.stack;
        errorResponse.details = error;
    }
    res.status(statusCode).json(errorResponse);
};
exports.globalErrorHandler = globalErrorHandler;
// 404 handler for undefined routes
const notFoundHandler = (req, res) => {
    res.status(404).json({
        success: false,
        message: `Rota não encontrada: ${req.method} ${req.url}`,
        timestamp: new Date().toISOString(),
        availableRoutes: {
            projects: [
                'GET /api/projects',
                'POST /api/projects',
                'GET /api/projects/:id',
                'PUT /api/projects/:id',
                'DELETE /api/projects/:id',
                'GET /api/projects/:id/tasks',
                'POST /api/projects/:projectId/tasks',
                'GET /api/projects/:id/github/:username',
            ],
            tasks: [
                'GET /api/tasks',
                'GET /api/tasks/:id',
                'PUT /api/tasks/:id',
                'DELETE /api/tasks/:id',
            ],
            search: [
                'GET /api/search/projects?q=term',
                'GET /api/search/tasks?q=term',
            ],
            stats: [
                'GET /api/stats/projects',
                'GET /api/stats/tasks',
            ],
        },
    });
};
exports.notFoundHandler = notFoundHandler;
// Request logging middleware
const requestLogger = (req, res, next) => {
    const start = Date.now();
    res.on('finish', () => {
        const duration = Date.now() - start;
        const logLevel = res.statusCode >= 400 ? 'error' : 'info';
        console.log(`[${logLevel.toUpperCase()}] ${req.method} ${req.url} - ${res.statusCode} - ${duration}ms`);
        if (logLevel === 'error') {
            console.log('Request details:', {
                headers: req.headers,
                body: req.body,
                params: req.params,
                query: req.query,
                ip: req.ip,
                userAgent: req.get('User-Agent'),
            });
        }
    });
    next();
};
exports.requestLogger = requestLogger;
// Rate limiting middleware (simple implementation)
const rateLimitMap = new Map();
const rateLimit = (maxRequests = 100, windowMs = 15 * 60 * 1000) => {
    return (req, res, next) => {
        const clientId = req.ip || 'unknown';
        const now = Date.now();
        // Clean expired entries
        for (const [key, value] of rateLimitMap.entries()) {
            if (now > value.resetTime) {
                rateLimitMap.delete(key);
            }
        }
        const clientData = rateLimitMap.get(clientId);
        if (!clientData) {
            // First request from this client
            rateLimitMap.set(clientId, {
                count: 1,
                resetTime: now + windowMs,
            });
            next();
            return;
        }
        if (now > clientData.resetTime) {
            // Window has expired, reset
            rateLimitMap.set(clientId, {
                count: 1,
                resetTime: now + windowMs,
            });
            next();
            return;
        }
        if (clientData.count >= maxRequests) {
            // Rate limit exceeded
            res.status(429).json({
                success: false,
                message: 'Muitas requisições. Tente novamente mais tarde.',
                retryAfter: Math.ceil((clientData.resetTime - now) / 1000),
            });
            return;
        }
        // Increment counter
        clientData.count++;
        next();
    };
};
exports.rateLimit = rateLimit;
// CORS middleware
const corsMiddleware = (req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
        return;
    }
    next();
};
exports.corsMiddleware = corsMiddleware;
//# sourceMappingURL=errorHandler.js.map