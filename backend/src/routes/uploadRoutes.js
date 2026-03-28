import express from 'express';
import { getImageKitAuth } from '../controllers/uploadController.js';

const router = express.Router();

router.get('/imagekit-auth', getImageKitAuth);

export default router;
