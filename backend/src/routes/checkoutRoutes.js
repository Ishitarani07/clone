import express from 'express';
import {
  createRazorpayOrder,
  verifyPayment,
  getOrderById,
  getOrders,
} from '../controllers/checkoutController.js';

const router = express.Router();

router.post('/create-razorpay-order', createRazorpayOrder);
router.post('/verify-payment', verifyPayment);
router.get('/orders', getOrders);
router.get('/orders/:id', getOrderById);

export default router;
