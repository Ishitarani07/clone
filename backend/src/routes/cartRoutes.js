import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
} from '../controllers/cartController.js';

const router = express.Router();

router.get('/', getCart);
router.post('/items', addToCart);
router.patch('/items/:productId', updateCartItem);
router.delete('/items/:productId', removeCartItem);

export default router;
