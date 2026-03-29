import express from 'express';
import { registerUser, loginUser, logoutUser, getCurrentUser } from '../controllers/authController.js';
import { registerValidator, loginValidator } from '../validators/authValidators.js';
import validateRequest from '../middlewares/validateRequest.js';
import { protect } from '../middlewares/authMiddleware.js';

const router = express.Router();

router.post('/register', registerValidator, validateRequest, registerUser);
router.post('/login', loginValidator, validateRequest, loginUser);
router.post('/logout', logoutUser);
router.get('/me', protect, getCurrentUser);

export default router;
