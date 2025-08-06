import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import type { IUser } from '../models/User';

interface AuthRequest extends express.Request {
  user?: IUser;
}

export const auth = async (req: AuthRequest, res: express.Response, next: express.NextFunction) => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
      throw new Error();
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new Error();
    }

    req.user = user;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Please authenticate' });
  }
};

export default auth;
