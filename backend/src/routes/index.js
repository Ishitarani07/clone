import express from 'express';
import categoryRoutes from './categoryRoutes.js';
import productRoutes from './productRoutes.js';
import cartRoutes from './cartRoutes.js';
import checkoutRoutes from './checkoutRoutes.js';
import uploadRoutes from './uploadRoutes.js';
import wishlistRoutes from './wishlistRoutes.js';

const router = express.Router();

router.get('/health', (req, res) => {
  res.json({ success: true, message: 'API is running' });
});

router.use('/categories', categoryRoutes);
router.use('/products', productRoutes);
router.use('/cart', cartRoutes);
router.use('/checkout', checkoutRoutes);
router.use('/uploads', uploadRoutes);
router.use('/wishlist', wishlistRoutes);

export default router;
