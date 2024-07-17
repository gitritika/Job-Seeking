// auth.js

import jwt from 'jsonwebtoken';
import { User } from '../models/userSchema.js';
import ErrorHandler from './error.js';

export const isAuthenticated = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    console.log('Token:', token);

    if (!token) {
      throw new ErrorHandler('User Not Authorized', 401);
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    console.log('Decoded:', decoded);
    
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      throw new ErrorHandler('User Not Found', 404);
    }

    next();
  } catch (error) {
    next(error);
  }
};
