import { Wishlist, Product, Cart } from '../models/index.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendResponse, sendError } from '../utils/apiResponse.js';

export const getWishlist = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  let wishlist = await Wishlist.findOne({ userId }).populate({
    path: 'items.productId',
    select: 'title slug images finalPrice price brand ratingAverage ratingCount stock',
  });

  if (!wishlist) {
    wishlist = await Wishlist.create({ userId, items: [] });
  }

  let mutated = false;
  const items = wishlist.items.reduce((acc, item) => {
    if (!item.productId) {
      mutated = true;
      return acc;
    }

    acc.push({
      productId: item.productId._id,
      title: item.productId.title,
      slug: item.productId.slug,
      image: item.productId.images?.[0]?.url || null,
      price: item.productId.price,
      finalPrice: item.productId.finalPrice,
      brand: item.productId.brand,
      ratingAverage: item.productId.ratingAverage,
      ratingCount: item.productId.ratingCount,
      stock: item.productId.stock,
      addedAt: item.addedAt,
    });

    return acc;
  }, []);

  if (mutated) {
    wishlist.items = wishlist.items.filter((item) => Boolean(item.productId));
    await wishlist.save();
  }

  sendResponse(res, 200, 'Wishlist fetched successfully', {
    items,
    itemCount: items.length,
  });
});

export const addToWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.body;
  const userId = req.user._id;

  const product = await Product.findById(productId);
  if (!product) {
    return sendError(res, 404, 'Product not found');
  }

  let wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) {
    wishlist = new Wishlist({ userId, items: [] });
  }

  const alreadyExists = wishlist.items.some(
    (item) => item.productId.toString() === productId
  );

  if (alreadyExists) {
    return sendError(res, 400, 'Product already in wishlist');
  }

  wishlist.items.push({ productId });
  await wishlist.save();

  sendResponse(res, 201, 'Product added to wishlist');
});

export const removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  const wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) {
    return sendError(res, 404, 'Wishlist not found');
  }

  const itemExists = wishlist.items.some(
    (item) => item.productId.toString() === productId
  );

  if (!itemExists) {
    return sendError(res, 404, 'Product not in wishlist');
  }

  wishlist.items = wishlist.items.filter(
    (item) => item.productId.toString() !== productId
  );
  await wishlist.save();

  sendResponse(res, 200, 'Product removed from wishlist');
});

export const moveToCart = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const userId = req.user._id;

  const wishlist = await Wishlist.findOne({ userId });
  if (!wishlist) {
    return sendError(res, 404, 'Wishlist not found');
  }

  const item = wishlist.items.find((entry) => entry.productId.toString() === productId);
  if (!item) {
    return sendError(res, 404, 'Product not in wishlist');
  }

  const product = await Product.findById(productId);
  if (!product) {
    return sendError(res, 404, 'Product not found');
  }

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  const cartItemIndex = cart.items.findIndex(
    (cartItem) => cartItem.productId.toString() === productId
  );

  if (cartItemIndex > -1) {
    if (cart.items[cartItemIndex].quantity + 1 > product.stock) {
      return sendError(res, 400, 'Insufficient stock');
    }
    cart.items[cartItemIndex].quantity += 1;
  } else {
    if (product.stock < 1) {
      return sendError(res, 400, 'Out of stock');
    }
    cart.items.push({ productId, quantity: 1, priceAtAdd: product.finalPrice });
  }

  await cart.save();

  wishlist.items = wishlist.items.filter(
    (entry) => entry.productId.toString() !== productId
  );
  await wishlist.save();

  sendResponse(res, 200, 'Product moved to cart');
});
