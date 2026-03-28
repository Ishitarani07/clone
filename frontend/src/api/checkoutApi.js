import api from './axios';

export const createRazorpayOrder = () => {
  return api.post('/checkout/create-razorpay-order');
};

export const verifyPayment = (paymentData) => {
  return api.post('/checkout/verify-payment', paymentData);
};

export const getOrderById = (orderId) => {
  return api.get(`/checkout/orders/${orderId}`);
};

export const getOrders = () => {
  return api.get('/checkout/orders');
};
