import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import routes from './src/routes/index.js';
import { notFound, errorHandler } from './src/middlewares/errorHandler.js';
import connectDB from './src/config/db.js';

const app = express();

// Manual CORS (more predictable on serverless): allow exact origins and short-circuit OPTIONS
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  process.env.CLIENT_URL,
  process.env.ALLOWED_ORIGINS,
].filter(Boolean);

app.use(cors({
  origin: (origin, callback) => {
    const isVercelOrigin = origin && /\.vercel\.app$/.test(origin);
    
    if (!origin || allowedOrigins.includes(origin) || isVercelOrigin) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  maxAge: 86400
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Ensure DB connection before handling API routes
app.use('/api/v1', async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error('DB connection error:', error);
    res.status(500).json({ success: false, message: 'Database connection failed' });
  }
});
app.use('/api/v1', routes);

// Health check
app.get('/', (req, res) => {
  res.json({ success: true, message: 'Flipkart Clone API is running' });
});

// Error handling
app.use(notFound);
app.use(errorHandler);

// Start server (local dev) or export for Vercel
const PORT = process.env.PORT || 5001;
const isVercel = !!process.env.VERCEL;

if (isVercel) {
  // Initialize DB on cold start but do not listen; Vercel will invoke the handler
  connectDB().catch((err) => {
    console.error('MongoDB connection error on Vercel init:', err);
  });
} else {
  connectDB()
    .then(() => {
      app.listen(PORT, () => {
        console.log(`Server is running on http://localhost:${PORT}`);
      });
    })
    .catch((err) => {
      console.error('Failed to connect to MongoDB, server not started:', err);
      process.exit(1);
    });
}

export default app;
export const config = {
  api: {
    bodyParser: false,
  },
};
