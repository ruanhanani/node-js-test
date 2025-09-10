import { Request, Response, NextFunction } from 'express';
import { ValidationError } from 'sequelize';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;

  constructor(message: string, statusCode: number = 500, isOperational: boolean = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Create specific error types
export class NotFoundError extends ApiError {
  constructor(message: string = 'Recurso não encontrado') {
    super(message, 404);
  }
}

export class BadRequestError extends ApiError {
  constructor(message: string = 'Requisição inválida') {
    super(message, 400);
  }
}

export class UnauthorizedError extends ApiError {
  constructor(message: string = 'Não autorizado') {
    super(message, 401);
  }
}

export class ForbiddenError extends ApiError {
  constructor(message: string = 'Proibido') {
    super(message, 403);
  }
}

export class ConflictError extends ApiError {
  constructor(message: string = 'Conflito de dados') {
    super(message, 409);
  }
}

export class InternalServerError extends ApiError {
  constructor(message: string = 'Erro interno do servidor') {
    super(message, 500);
  }
}

// Async error wrapper
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};

// Global error handler middleware
export const globalErrorHandler = (
  error: AppError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  let { statusCode = 500, message } = error;

  // Handle different types of errors
  if (error instanceof ValidationError) {
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
  const errorResponse: any = {
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

// 404 handler for undefined routes
export const notFoundHandler = (req: Request, res: Response): void => {
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

// Request logging middleware
export const requestLogger = (req: Request, res: Response, next: NextFunction): void => {
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

// Rate limiting middleware (simple implementation)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

export const rateLimit = (maxRequests: number = 100, windowMs: number = 15 * 60 * 1000) => {
  return (req: Request, res: Response, next: NextFunction): void => {
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

// CORS middleware
export const corsMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
    return;
  }
  
  next();
};
