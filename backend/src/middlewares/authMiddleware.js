import jwt from 'jsonwebtoken';
import asyncHandler from '../utils/asyncHandler.js';
import { sendError } from '../utils/apiResponse.js';
import { User } from '../models/index.js';

export const protect = asyncHandler(async (req, res, next) => {
  const token = req.cookies?.token;

  if (!token) {
    return sendError(res, 401, 'Not authorized, please log in');
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);

    if (!user) {
      return sendError(res, 401, 'User no longer exists');
    }

    req.user = user;
    next();
  } catch (error) {
    return sendError(res, 401, 'Not authorized, invalid token');
  }
});
