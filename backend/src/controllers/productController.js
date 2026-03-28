import { Product } from '../models/index.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendResponse, sendError } from '../utils/apiResponse.js';

const buildSearchQuery = (searchTerm) => {
  if (!searchTerm) return null;

  const escaped = searchTerm
    .trim()
    .split(/\s+/)
    .map((token) => token.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
    .join('.*');

  if (!escaped) return null;

  const regex = new RegExp(escaped, 'i');

  return {
    $or: [{ title: regex }, { description: regex }, { brand: regex }],
  };
};

export const getProducts = asyncHandler(async (req, res) => {
  const {
    search,
    category,
    sort,
    page = 1,
    limit = 12,
    priceMin,
    priceMax,
    ratingMin,
    ratingMax,
    brands,
  } = req.query;

  const query = { isActive: true };

  const searchQuery = buildSearchQuery(search);
  if (searchQuery) {
    Object.assign(query, searchQuery);
  }

  if (category) {
    query.categoryId = category;
  }

  if (priceMin || priceMax) {
    query.finalPrice = {};
    if (priceMin) query.finalPrice.$gte = Number(priceMin);
    if (priceMax) query.finalPrice.$lte = Number(priceMax);
  }

  if (ratingMin || ratingMax) {
    query.ratingAverage = {};
    if (ratingMin) query.ratingAverage.$gte = Number(ratingMin);
    if (ratingMax) query.ratingAverage.$lte = Number(ratingMax);
  }

  if (brands) {
    const brandList = brands
      .split(',')
      .map((brand) => brand.trim())
      .filter(Boolean);

    if (brandList.length) {
      query.brand = { $in: brandList };
    }
  }

  let sortOption = { createdAt: -1 };
  if (sort === 'price_asc') sortOption = { finalPrice: 1 };
  else if (sort === 'price_desc') sortOption = { finalPrice: -1 };
  else if (sort === 'popularity') sortOption = { ratingCount: -1 };

  const skip = (parseInt(page) - 1) * parseInt(limit);

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('categoryId', 'name slug')
      .sort(sortOption)
      .skip(skip)
      .limit(parseInt(limit)),
    Product.countDocuments(query),
  ]);

  sendResponse(res, 200, 'Products fetched successfully', {
    products,
    pagination: {
      page: parseInt(page),
      limit: parseInt(limit),
      total,
      pages: Math.ceil(total / parseInt(limit)),
    },
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id).populate('categoryId', 'name slug');

  if (!product) {
    return sendError(res, 404, 'Product not found');
  }

  sendResponse(res, 200, 'Product fetched successfully', product);
});

export const getProductFilters = asyncHandler(async (req, res) => {
  const [{ minPrice = 0, maxPrice = 0, minRating = 0, maxRating = 0 } = {}] = await Product.aggregate([
    { $match: { isActive: true } },
    {
      $group: {
        _id: null,
        minPrice: { $min: '$finalPrice' },
        maxPrice: { $max: '$finalPrice' },
        minRating: { $min: '$ratingAverage' },
        maxRating: { $max: '$ratingAverage' },
      },
    },
  ]);

  const brands = await Product.distinct('brand', { isActive: true });

  sendResponse(res, 200, 'Product filters fetched successfully', {
    priceRange: {
      min: Math.floor(minPrice || 0),
      max: Math.ceil(maxPrice || 0),
    },
    ratingRange: {
      min: Math.max(0, Math.floor(minRating || 0)),
      max: Math.min(5, Math.ceil(maxRating || 5)),
    },
    brands: brands.sort(),
  });
});
