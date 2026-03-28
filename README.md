# Flipkart Clone - E-Commerce Platform

A full-stack e-commerce web application replicating Flipkart's design and user experience. Built as part of the Scaler SDE Intern Fullstack Assignment.

## Tech Stack

### Frontend
- **React 19** with Vite
- **Tailwind CSS v4** for styling
- **React Router v6** for routing
- **Axios** for API calls
- **React Hot Toast** for notifications

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **Razorpay** for payment processing
- **ImageKit** for image management

## Features

### Core Features
- ✅ Product listing with grid layout (Flipkart-style cards)
- ✅ Search functionality by product name
- ✅ Filter products by category
- ✅ Sort by price and popularity
- ✅ Product detail page with image gallery
- ✅ Product specifications and highlights
- ✅ Stock availability status
- ✅ Shopping cart with quantity management
- ✅ Cart summary with subtotal and total
- ✅ Checkout with shipping address form
- ✅ Razorpay payment integration
- ✅ Order confirmation with order ID

### Bonus Features
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Loading skeletons for better UX
- ✅ Toast notifications for user feedback

## Project Structure

```
├── frontend/
│   ├── src/
│   │   ├── api/           # API service layer
│   │   ├── components/    # Reusable UI components
│   │   ├── context/       # React Context (Cart state)
│   │   ├── pages/         # Page components
│   │   └── utils/         # Utility functions
│   └── ...
│
├── backend/
│   ├── src/
│   │   ├── config/        # DB, Razorpay, ImageKit config
│   │   ├── controllers/   # Request handlers
│   │   ├── middlewares/   # Error handling
│   │   ├── models/        # Mongoose schemas
│   │   ├── routes/        # API routes
│   │   └── utils/         # Helper functions
│   └── scripts/
│       └── seed.js        # Database seeder
└── ...
```

## Database Schema

- **Users** - User profile with addresses
- **Categories** - Product categories
- **Products** - Product catalog with images, specs, pricing
- **Carts** - User shopping carts
- **Orders** - Order history with payment info

## Setup Instructions

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- Razorpay account (for payments)
- ImageKit account (optional, for image uploads)

### Backend Setup

1. Navigate to backend directory:
   ```bash
   cd backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file (copy from `.env.example`):
   ```bash
   cp .env.example .env
   ```

4. Update `.env` with your credentials:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/flipkart-clone
   CLIENT_URL=http://localhost:5173
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
   IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
   IMAGEKIT_URL_ENDPOINT=https://ik.imagekit.io/your_id
   ```

5. Seed the database:
   ```bash
   npm run seed
   ```

6. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create `.env` file:
   ```bash
   cp .env.example .env
   ```

4. Update `.env`:
   ```env
   VITE_API_BASE_URL=http://localhost:5000/api/v1
   VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
   ```

5. Start the development server:
   ```bash
   npm run dev
   ```

6. Open http://localhost:5173 in your browser

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/v1/health` | Health check |
| GET | `/api/v1/categories` | Get all categories |
| GET | `/api/v1/products` | Get products (with filters) |
| GET | `/api/v1/products/:id` | Get product details |
| GET | `/api/v1/cart` | Get cart |
| POST | `/api/v1/cart/items` | Add item to cart |
| PATCH | `/api/v1/cart/items/:productId` | Update cart item |
| DELETE | `/api/v1/cart/items/:productId` | Remove cart item |
| POST | `/api/v1/checkout/create-razorpay-order` | Create payment order |
| POST | `/api/v1/checkout/verify-payment` | Verify payment & create order |
| GET | `/api/v1/checkout/orders/:id` | Get order details |

## Assumptions & Trade-offs

1. **No Authentication**: As per assignment requirements, a default user is assumed to be logged in. All cart and order operations use this default user.

2. **Image URLs**: Sample products use placeholder ImageKit URLs. In production, actual product images would be uploaded via ImageKit.

3. **Payment Testing**: Use Razorpay test mode credentials for development. Test card: 4111 1111 1111 1111

4. **Stock Management**: Stock is decremented atomically upon successful payment verification.

5. **Shipping Fee**: Free delivery for orders above ₹500, otherwise ₹40 shipping fee.

## Deployment

### Frontend (Vercel/Netlify)
1. Connect your GitHub repository
2. Set build command: `npm run build`
3. Set output directory: `dist`
4. Add environment variables

### Backend (Render/Railway)
1. Connect your GitHub repository
2. Set build command: `npm install`
3. Set start command: `npm start`
4. Add environment variables

## License

This project is created for educational purposes as part of the Scaler SDE Intern assignment.
