import { Category } from '../models/index.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendResponse } from '../utils/apiResponse.js';

export const getCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find().sort({ name: 1 });
  sendResponse(res, 200, 'Categories fetched successfully', categories);
});
