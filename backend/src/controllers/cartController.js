import { Cart, Product } from '../models/index.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendResponse, sendError } from '../utils/apiResponse.js';
import { DEFAULT_USER_ID } from '../utils/constants.js';
import mongoose from 'mongoose';

const getUserId = () => new mongoose.Types.ObjectId(DEFAULT_USER_ID);

export const getCart = asyncHandler(async (req, res) => {
  let cart = await Cart.findOne({ userId: getUserId() }).populate({
    path: 'items.productId',
    select: 'title slug images finalPrice stock',
  });

  if (!cart) {
    cart = { items: [], userId: getUserId() };
  }

  const cartItems = cart.items.map((item) => ({
    productId: item.productId._id,
    title: item.productId.title,
    slug: item.productId.slug,
    image: item.productId.images?.[0]?.url || null,
    price: item.productId.finalPrice,
    stock: item.productId.stock,
    quantity: item.quantity,
    lineTotal: item.productId.finalPrice * item.quantity,
  }));

  const subtotal = cartItems.reduce((sum, item) => sum + item.lineTotal, 0);

  sendResponse(res, 200, 'Cart fetched successfully', {
    items: cartItems,
    itemCount: cartItems.length,
    subtotal,
  });
});

export const addToCart = asyncHandler(async (req, res) => {
  const { productId, quantity = 1 } = req.body;

  const product = await Product.findById(productId);
  if (!product) {
    return sendError(res, 404, 'Product not found');
  }

  if (product.stock < quantity) {
    return sendError(res, 400, 'Insufficient stock');
  }

  let cart = await Cart.findOne({ userId: getUserId() });

  if (!cart) {
    cart = new Cart({
      userId: getUserId(),
      items: [],
    });
  }

  const existingItemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (existingItemIndex > -1) {
    const newQty = cart.items[existingItemIndex].quantity + quantity;
    if (newQty > product.stock) {
      return sendError(res, 400, 'Insufficient stock');
    }
    cart.items[existingItemIndex].quantity = newQty;
  } else {
    cart.items.push({
      productId,
      quantity,
      priceAtAdd: product.finalPrice,
    });
  }

  await cart.save();
  sendResponse(res, 200, 'Item added to cart');
});

export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  const { quantity } = req.body;

  if (quantity < 1) {
    return sendError(res, 400, 'Quantity must be at least 1');
  }

  const product = await Product.findById(productId);
  if (!product) {
    return sendError(res, 404, 'Product not found');
  }

  if (product.stock < quantity) {
    return sendError(res, 400, 'Insufficient stock');
  }

  const cart = await Cart.findOne({ userId: getUserId() });
  if (!cart) {
    return sendError(res, 404, 'Cart not found');
  }

  const itemIndex = cart.items.findIndex(
    (item) => item.productId.toString() === productId
  );

  if (itemIndex === -1) {
    return sendError(res, 404, 'Item not in cart');
  }

  cart.items[itemIndex].quantity = quantity;
  await cart.save();

  sendResponse(res, 200, 'Cart item updated');
});

export const removeCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params;

  const cart = await Cart.findOne({ userId: getUserId() });
  if (!cart) {
    return sendError(res, 404, 'Cart not found');
  }

  cart.items = cart.items.filter(
    (item) => item.productId.toString() !== productId
  );

  await cart.save();
  sendResponse(res, 200, 'Item removed from cart');
});
