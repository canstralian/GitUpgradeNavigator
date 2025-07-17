
import { Request, Response, NextFunction } from 'express';

export interface AppError extends Error {
  statusCode?: number;
  isOperational?: boolean;
}

export function createError(message: string, statusCode: number = 500): AppError {
  const error: AppError = new Error(message);
  error.statusCode = statusCode;
  error.isOperational = true;
  return error;
}

export function errorHandler(error: AppError, req: Request, res: Response, next: NextFunction) {
  const { statusCode = 500, message, stack } = error;

  // Log error details
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path} - ${statusCode}: ${message}`);
  
  if (process.env.NODE_ENV === 'development') {
    console.error(stack);
  }

  // Don't expose internal errors in production
  const isProduction = process.env.NODE_ENV === 'production';
  const responseMessage = isProduction && statusCode >= 500 ? 'Internal server error' : message;

  res.status(statusCode).json({
    error: responseMessage,
    ...(process.env.NODE_ENV === 'development' && { stack })
  });
}

export function notFoundHandler(req: Request, res: Response) {
  res.status(404).json({
    error: 'Resource not found',
    path: req.path
  });
}

export function asyncHandler(fn: Function) {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
