import asyncHandler from '../utils/asyncHandler.js';
import { sendResponse, sendError } from '../utils/apiResponse.js';
import { attachTokenToResponse, clearAuthCookie } from '../utils/token.js';
import { User, Cart, Wishlist } from '../models/index.js';

const buildUserPayload = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  phone: user.phone,
  role: user.role,
  addresses: user.addresses,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

export const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return sendError(res, 400, 'Email is already registered');
  }

  const user = await User.create({ name, email, password, phone });

  await Promise.all([
    Cart.create({ userId: user._id, items: [] }),
    Wishlist.create({ userId: user._id, items: [] }),
  ]);

  attachTokenToResponse(res, user._id);
  sendResponse(res, 201, 'User registered successfully', { user: buildUserPayload(user) });
});

export const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email }).select('+password');
  if (!user) {
    return sendError(res, 401, 'Invalid email or password');
  }

  const isMatch = await user.matchPassword(password);
  if (!isMatch) {
    return sendError(res, 401, 'Invalid email or password');
  }

  attachTokenToResponse(res, user._id);
  const userDetails = await User.findById(user._id).select('-password');
  sendResponse(res, 200, 'Logged in successfully', { user: buildUserPayload(userDetails) });
});

export const logoutUser = asyncHandler(async (_req, res) => {
  clearAuthCookie(res);
  sendResponse(res, 200, 'Logged out successfully');
});

export const getCurrentUser = asyncHandler(async (req, res) => {
  sendResponse(res, 200, 'User fetched successfully', { user: buildUserPayload(req.user) });
});
