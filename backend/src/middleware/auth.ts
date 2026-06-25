import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';

export interface AuthRequest extends Request {
  user?: User;
}

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_key_change_me_in_production';

export async function authMiddleware(req: AuthRequest, res: Response, next: NextFunction): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ error: 'Access denied. No token provided.' });
      return;
    }

    const token = authHeader.split(' ')[1];
    if (!token) {
      res.status(401).json({ error: 'Access denied. Invalid token format.' });
      return;
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { id: string; username: string };
    
    // Fetch user from DB to ensure they still exist
    const user = await User.findByPk(decoded.id);
    if (!user) {
      res.status(401).json({ error: 'Access denied. User no longer exists.' });
      return;
    }

    // Attach user to Request object
    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Access denied. Invalid or expired token.' });
  }
}
