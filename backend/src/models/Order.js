import mongoose from 'mongoose';
import { ORDER_STATUS, PAYMENT_STATUS } from '../utils/constants.js';

const orderItemSchema = new mongoose.Schema({
  productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  title: { type: String, required: true },
  image: { type: String },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
  lineTotal: { type: Number, required: true },
});

const shippingAddressSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  mobile: { type: String, required: true },
  pincode: { type: String, required: true },
  city: { type: String, required: true },
  state: { type: String, required: true },
  line1: { type: String, required: true },
  line2: { type: String },
  landmark: { type: String },
});

const pricingSchema = new mongoose.Schema({
  subtotal: { type: Number, required: true },
  shippingFee: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  total: { type: Number, required: true },
});

const paymentSchema = new mongoose.Schema({
  method: { type: String, default: 'razorpay' },
  razorpayOrderId: { type: String },
  razorpayPaymentId: { type: String },
  razorpaySignature: { type: String },
  status: {
    type: String,
    enum: Object.values(PAYMENT_STATUS),
    default: PAYMENT_STATUS.CREATED,
  },
});

const orderSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    orderNumber: { type: String, required: true, unique: true },
    items: [orderItemSchema],
    shippingAddress: shippingAddressSchema,
    pricing: pricingSchema,
    payment: paymentSchema,
    orderStatus: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PLACED,
    },
    placedAt: { type: Date },
  },
  { timestamps: true }
);

orderSchema.index({ userId: 1, createdAt: -1 });

const Order = mongoose.model('Order', orderSchema);

export default Order;
