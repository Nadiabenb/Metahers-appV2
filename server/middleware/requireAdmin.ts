
import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger';

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = req.user;

  if (!user) {
    logger.warn({ path: req.path }, 'Unauthorized admin access attempt - no user');
    return res.status(401).json({ 
      error: 'Authentication required',
      message: 'You must be logged in to access this resource'
    });
  }

  if (!user.isAdmin) {
    logger.warn({ 
      userId: user.id, 
      email: user.email, 
      path: req.path 
    }, 'Forbidden admin access attempt - user is not admin');
    
    return res.status(403).json({ 
      error: 'Forbidden',
      message: 'You do not have permission to access this resource'
    });
  }

  logger.info({ 
    adminId: user.id, 
    email: user.email, 
    path: req.path,
    method: req.method
  }, 'Admin access granted');
  
  next();
}
