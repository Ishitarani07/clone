import crypto from 'crypto';
import { Cart, Product, Order, User } from '../models/index.js';
import razorpay from '../config/razorpay.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendResponse, sendError } from '../utils/apiResponse.js';
import { PAYMENT_STATUS, ORDER_STATUS } from '../utils/constants.js';
import { sendEmail } from '../config/email.js';
import { orderConfirmationTemplate } from '../utils/emailTemplates.js';

const generateOrderNumber = () => {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `FK${timestamp}${random}`;
};

export const createRazorpayOrder = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const cart = await Cart.findOne({ userId }).populate({
    path: 'items.productId',
    select: 'title finalPrice stock images',
  });

  if (!cart || cart.items.length === 0) {
    return sendError(res, 400, 'Cart is empty');
  }

  // Validate stock
  for (const item of cart.items) {
    if (item.productId.stock < item.quantity) {
      return sendError(res, 400, `Insufficient stock for ${item.productId.title}`);
    }
  }

  // Calculate total from DB (never trust frontend)
  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.productId.finalPrice * item.quantity,
    0
  );
  const shippingFee = subtotal >= 500 ? 0 : 40;
  const total = subtotal + shippingFee;

  // Create Razorpay order
  const razorpayOrder = await razorpay.orders.create({
    amount: Math.round(total * 100), // in paise
    currency: 'INR',
    receipt: generateOrderNumber(),
  });

  sendResponse(res, 200, 'Razorpay order created', {
    orderId: razorpayOrder.id,
    amount: razorpayOrder.amount,
    currency: razorpayOrder.currency,
    subtotal,
    shippingFee,
    total,
  });
});

export const verifyPayment = asyncHandler(async (req, res) => {
  const {
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    shippingAddress,
  } = req.body;

  // Verify signature
  const body = razorpay_order_id + '|' + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
    .update(body)
    .digest('hex');

  if (expectedSignature !== razorpay_signature) {
    return sendError(res, 400, 'Payment verification failed');
  }

  // Get cart and calculate totals
  const userId = req.user._id;

  const cart = await Cart.findOne({ userId }).populate({
    path: 'items.productId',
    select: 'title finalPrice stock images',
  });

  if (!cart || cart.items.length === 0) {
    return sendError(res, 400, 'Cart is empty');
  }

  const orderItems = cart.items.map((item) => ({
    productId: item.productId._id,
    title: item.productId.title,
    image: item.productId.images?.[0]?.url || null,
    quantity: item.quantity,
    price: item.productId.finalPrice,
    lineTotal: item.productId.finalPrice * item.quantity,
  }));

  const subtotal = orderItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const shippingFee = subtotal >= 500 ? 0 : 40;
  const total = subtotal + shippingFee;

  // Create order
  const order = new Order({
    userId,
    orderNumber: generateOrderNumber(),
    items: orderItems,
    shippingAddress,
    pricing: {
      subtotal,
      shippingFee,
      discount: 0,
      total,
    },
    payment: {
      method: 'razorpay',
      razorpayOrderId: razorpay_order_id,
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status: PAYMENT_STATUS.PAID,
    },
    orderStatus: ORDER_STATUS.PLACED,
    placedAt: new Date(),
  });

  await order.save();

  // Decrement stock
  for (const item of cart.items) {
    await Product.findByIdAndUpdate(item.productId._id, {
      $inc: { stock: -item.quantity },
    });
  }

  // Clear cart
  cart.items = [];
  await cart.save();

  // Send order confirmation email
  try {
    const user = await User.findById(userId);
    if (user && user.email) {
      const emailHtml = orderConfirmationTemplate(order, user);
      await sendEmail({
        to: user.email,
        subject: `Order Confirmed - ${order.orderNumber}`,
        html: emailHtml,
      });
    }
  } catch (emailError) {
    console.error('Failed to send order confirmation email:', emailError);
  }

  sendResponse(res, 201, 'Order placed successfully', {
    orderId: order._id,
    orderNumber: order.orderNumber,
  });
});

export const getOrderById = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const order = await Order.findOne({ _id: req.params.id, userId });

  if (!order) {
    return sendError(res, 404, 'Order not found');
  }

  sendResponse(res, 200, 'Order fetched successfully', order);
});

export const getOrders = asyncHandler(async (req, res) => {
  const userId = req.user._id;
  const orders = await Order.find({ userId })
    .sort({ createdAt: -1 })
    .select('orderNumber items pricing orderStatus placedAt');

  sendResponse(res, 200, 'Orders fetched successfully', orders);
});
