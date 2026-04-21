import { Request, Response, NextFunction } from 'express';
import { logger } from '../lib/logger';
import { storage } from '../storage';

export async function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (!req.session || !req.session.userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const user = await storage.getUser(req.session.userId as string);
    if (!user) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const adminEmails = (process.env.ADMIN_EMAILS || '')
      .split(',')
      .map(e => e.trim().toLowerCase());

    if (!adminEmails.includes(user.email.toLowerCase())) {
      logger.warn({ userId: user.id, email: user.email, path: req.path }, 'Admin access denied');
      return res.status(403).json({ message: 'Admin access required' });
    }

    logger.info({ userId: user.id, email: user.email, path: req.path }, 'Admin access granted');
    next();
  } catch (err: any) {
    logger.error({ error: err.message }, 'requireAdmin error');
    return res.status(500).json({ message: 'Internal server error' });
  }
}
