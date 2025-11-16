
import { Request, Response, NextFunction } from 'express';
import { randomUUID } from 'crypto';
import { logger } from '../lib/logger';

declare global {
  namespace Express {
    interface Request {
      requestId?: string;
      startTime?: number;
    }
  }
}

export function requestLogger(req: Request, res: Response, next: NextFunction) {
  // Generate unique request ID
  const requestId = randomUUID();
  req.requestId = requestId;
  req.startTime = Date.now();

  // Extract user ID if available from session
  const userId = req.session?.userId;

  // Log incoming request
  logger.info({
    requestId,
    method: req.method,
    url: req.originalUrl || req.url,
    userId: userId || 'anonymous',
    ip: req.ip || req.socket.remoteAddress,
    userAgent: req.get('user-agent'),
  }, 'Incoming request');

  // Capture response
  const originalSend = res.send;
  res.send = function (data) {
    const duration = Date.now() - (req.startTime || Date.now());
    
    const logData = {
      requestId,
      method: req.method,
      url: req.originalUrl || req.url,
      statusCode: res.statusCode,
      userId: userId || 'anonymous',
      duration: `${duration}ms`,
    };

    if (res.statusCode >= 500) {
      logger.error(logData, 'Request failed with server error');
    } else if (res.statusCode >= 400) {
      logger.warn(logData, 'Request failed with client error');
    } else {
      logger.info(logData, 'Request completed');
    }

    return originalSend.call(this, data);
  };

  next();
}
