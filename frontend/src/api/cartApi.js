import api from './axios';

export const getCart = () => {
  return api.get('/cart');
};

export const addToCart = (productId, quantity = 1) => {
  return api.post('/cart/items', { productId, quantity });
};

export const updateCartItem = (productId, quantity) => {
  return api.patch(`/cart/items/${productId}`, { quantity });
};

export const removeCartItem = (productId) => {
  return api.delete(`/cart/items/${productId}`);
};
