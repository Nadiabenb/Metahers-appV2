
import { Request, Response, NextFunction } from 'express';

export class AppError extends Error {
  constructor(
    public message: string,
    public code: string,
    public statusCode: number = 500,
    public details?: any
  ) {
    super(message);
    this.name = 'AppError';
  }
}

// Database errors
export class DatabaseError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 'DATABASE_ERROR', 500, details);
  }
}

// OpenAI API errors
export class OpenAIError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 'OPENAI_ERROR', 503, details);
  }
}

export class OpenAITimeoutError extends AppError {
  constructor(message: string = 'OpenAI request timed out') {
    super(message, 'OPENAI_TIMEOUT', 504);
  }
}

export class OpenAIRateLimitError extends AppError {
  constructor(message: string = 'OpenAI rate limit exceeded') {
    super(message, 'OPENAI_RATE_LIMIT', 429);
  }
}

// Authentication errors
export class AuthenticationError extends AppError {
  constructor(message: string = 'Authentication required') {
    super(message, 'AUTH_REQUIRED', 401);
  }
}

export class AuthorizationError extends AppError {
  constructor(message: string = 'Insufficient permissions') {
    super(message, 'FORBIDDEN', 403);
  }
}

// Validation errors
export class ValidationError extends AppError {
  constructor(message: string, details?: any) {
    super(message, 'VALIDATION_ERROR', 400, details);
  }
}

// Not found errors
export class NotFoundError extends AppError {
  constructor(resource: string = 'Resource') {
    super(`${resource} not found`, 'NOT_FOUND', 404);
  }
}

// Global error handler middleware
export function errorHandler(
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // Log error for debugging
  console.error('Error caught by handler:', {
    name: err.name,
    message: err.message,
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    path: req.path,
    method: req.method,
  });

  // Handle AppError instances
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      error: err.message,
      code: err.code,
      details: process.env.NODE_ENV === 'development' ? err.details : undefined,
    });
  }

  // Handle Zod validation errors
  if (err.name === 'ZodError') {
    return res.status(400).json({
      error: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: process.env.NODE_ENV === 'development' ? err : undefined,
    });
  }

  // Handle database errors (PostgreSQL)
  if (err.message?.includes('database') || err.message?.includes('query')) {
    return res.status(500).json({
      error: 'Database operation failed',
      code: 'DATABASE_ERROR',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }

  // Handle OpenAI specific errors
  if (err.message?.includes('OpenAI') || err.message?.includes('AI')) {
    return res.status(503).json({
      error: 'AI service temporarily unavailable',
      code: 'AI_SERVICE_ERROR',
      details: process.env.NODE_ENV === 'development' ? err.message : undefined,
    });
  }

  // Default 500 error
  res.status(500).json({
    error: 'Internal server error',
    code: 'INTERNAL_ERROR',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined,
  });
}

// Async handler wrapper to catch promise rejections
export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
