import app from '../src/app.js';
import connectDB from '../src/config/db.js';

export const config = {
  api: {
    bodyParser: false,
    externalResolver: true,
  },
};

export default async function handler(req, res) {
  try {
    await connectDB();
    return app(req, res);
  } catch (error) {
    console.error('Serverless handler error:', error);
    if (!res.headersSent) {
      res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
  }
}
