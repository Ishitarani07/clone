import imagekit from '../config/imagekit.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/apiResponse.js';

export const getImageKitAuth = asyncHandler(async (req, res) => {
  const authParams = imagekit.getAuthenticationParameters();
  sendResponse(res, 200, 'ImageKit auth params', authParams);
});
