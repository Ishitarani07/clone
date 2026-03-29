# Flipkart Clone - Fullstack Execution Plan

## 1) Goal & Criteria

Build a Flipkart-like e-commerce platform with production-style architecture and clean modular code.

### Must Deliver
- Product listing page (search + category filter + Flipkart-style cards)
- Product detail page (carousel, specs, stock, add to cart, buy now)
- Cart page (update quantity, remove item, totals)
- Checkout + order placement + confirmation page (show order ID)

### Bonus (if time permits)
- Responsive polish (mobile/tablet/desktop)
- Authentication
- Order history
- Wishlist
- Email confirmation

---

## 2) Final Tech Stack (as requested)

- Frontend: `React + Vite + Tailwind CSS`
- Backend: `Node.js + Express.js`
- Database: `MongoDB + Mongoose`
- Payment: `Razorpay`
- Image Upload/Delivery: `ImageKit`
- Notifications: `react-hot-toast`

---

## 3) High-Level Architecture

### Frontend (`/frontend`)
- SPA with `react-router-dom`
- Feature-based folders (`products`, `cart`, `checkout`, `orders`, `common`)
- API service layer using `axios`
- Global state via `Context + useReducer` (or Redux Toolkit if already preferred)
- Toast UX feedback for all key actions

### Backend (`/backend`)
- Layered architecture:
  - `routes` -> request mapping
  - `controllers` -> request/response handling
  - `services` -> business logic
  - `models` -> Mongo schemas
  - `middlewares` -> validation, error handling
- REST APIs with consistent response format
- Payment verification webhook and signature checks for Razorpay

### Data Flow
1. Frontend fetches product catalog from backend
2. Cart updates are persisted in backend (for default user)
3. Checkout creates Razorpay order
4. Frontend opens Razorpay checkout
5. Backend verifies payment signature
6. On success, create final order + reduce stock + clear purchased cart items

---

## 4) MongoDB Schema Design

## `users`
- `_id`
- `name`
- `email`
- `phone`
- `addresses[]`:
  - `fullName`, `mobile`, `pincode`, `city`, `state`, `line1`, `line2`, `landmark`, `isDefault`
- `createdAt`, `updatedAt`

> For assignment scope with no login, create one seeded default user and use it everywhere.

## `categories`
- `_id`
- `name` (unique)
- `slug` (unique)
- `iconUrl` (optional)

## `products`
- `_id`
- `title`
- `slug`
- `description`
- `highlights[]`
- `specifications` (object/map)
- `categoryId` (ref `categories`)
- `brand`
- `price`
- `discountPercent`
- `finalPrice`
- `stock`
- `images[]`:
  - `url`, `fileId` (ImageKit file id)
- `ratingAverage`
- `ratingCount`
- `isActive`
- `createdAt`, `updatedAt`

## `carts`
- `_id`
- `userId` (ref `users`)
- `items[]`:
  - `productId` (ref `products`)
  - `quantity`
  - `priceAtAdd`
- `updatedAt`

## `orders`
- `_id`
- `userId` (ref `users`)
- `orderNumber` (human readable)
- `items[]`:
  - `productId`, `title`, `image`, `quantity`, `price`, `lineTotal`
- `shippingAddress` snapshot
- `pricing`:
  - `subtotal`, `shippingFee`, `discount`, `total`
- `payment`:
  - `method` (`razorpay`)
  - `razorpayOrderId`
  - `razorpayPaymentId`
  - `razorpaySignature`
  - `status` (`created`, `paid`, `failed`)
- `orderStatus` (`placed`, `packed`, `shipped`, `delivered`, `cancelled`)
- `placedAt`, `createdAt`, `updatedAt`

## Indexes
- `products`: `{ categoryId: 1, finalPrice: 1 }`, text index on `title`/`description`
- `orders`: `{ userId: 1, createdAt: -1 }`
- `carts`: unique `{ userId: 1 }`

---

## 5) Backend API Plan

Base URL: `/api/v1`

## Health
- `GET /health`

## Categories
- `GET /categories`

## Products
- `GET /products?search=&category=&sort=&page=&limit=`
- `GET /products/:id`

## Cart (default user)
- `GET /cart`
- `POST /cart/items` body: `{ productId, quantity }`
- `PATCH /cart/items/:productId` body: `{ quantity }`
- `DELETE /cart/items/:productId`

## Checkout + Orders
- `POST /checkout/create-razorpay-order` body: `{ addressId | addressPayload }`
- `POST /checkout/verify-payment` body: `{ razorpay_order_id, razorpay_payment_id, razorpay_signature, addressPayload }`
- `GET /orders/:orderId`
- `GET /orders` (for order history bonus)

## Image Upload (admin/seed utility)
- `POST /uploads/imagekit-auth` (returns ImageKit auth params)

### API Response Contract
Use a standard shape:
```json
{
  "success": true,
  "message": "...",
  "data": {}
}
```

### Error Strategy
- Central error middleware
- Validation errors -> `400`
- Not found -> `404`
- Payment verification failed -> `400`
- Server errors -> `500`

---

## 6) Frontend Plan (Pages + Components)

## Routes
- `/` -> Product Listing
- `/product/:id` -> Product Detail
- `/cart` -> Cart
- `/checkout` -> Checkout
- `/order/:id/confirmation` -> Confirmation

## Shared Components
- `Navbar` (logo, search, cart icon, maybe category quick links)
- `ProductCard`
- `PriceTag`
- `QuantitySelector`
- `EmptyState`
- `LoadingSkeleton`
- `ErrorState`
- `ProtectedLayout` (if auth is added later)

## Product Listing Page
- Fetch categories + products
- Search input with debounce (300ms)
- Category filter tabs/chips
- Sort options (price low-high/high-low, popularity)
- Pagination or infinite scroll

## Product Detail Page
- Image carousel/gallery
- Product details and spec table
- Price + discount presentation
- Stock badge
- `Add to Cart` action with toast
- `Buy Now` action: add item and navigate to checkout

## Cart Page
- Cart item list
- Quantity update controls
- Remove item action
- Real-time summary calculation
- CTA: Proceed to checkout

## Checkout Page
- Address form (validation)
- Order summary block
- Payment method display (Razorpay)
- Place order button -> creates Razorpay order and opens checkout modal

## Order Confirmation
- Show order ID, paid status, amount
- Show purchased items summary
- CTA: Continue shopping

---

## 7) State Management Plan

Use `Context + useReducer` with slices:
- `productState`: products, filters, loading, pagination
- `cartState`: items, totals, sync status
- `checkoutState`: address, payment status, placingOrder

Persist only required client state (e.g., address draft) in `localStorage`.
Primary source of truth should remain backend APIs.

---

## 8) Razorpay Integration Plan

1. Frontend calls `POST /checkout/create-razorpay-order`
2. Backend calculates total from DB cart data (never trust frontend total)
3. Backend creates Razorpay order and returns order metadata
4. Frontend opens Razorpay checkout with returned `order_id`
5. On payment success, frontend posts signature payload to backend
6. Backend verifies HMAC signature using Razorpay secret
7. On valid signature:
   - create order in DB
   - decrement stock atomically
   - clear purchased cart items
   - return created order
8. Frontend navigates to confirmation page and shows success toast

Failure cases:
- Payment modal close -> show cancellation toast
- Signature mismatch -> mark payment failed and show retry option

---

## 9) ImageKit Integration Plan

- Use ImageKit URL delivery for product images
- For upload flow:
  - Backend endpoint returns ImageKit auth params
  - Frontend uploads directly to ImageKit
  - Store `url` + `fileId` in `products.images[]`
- Add fallback image on frontend if broken URL

---

## 10) Tailwind + UI Plan (Flipkart-like)

- Build theme tokens in `tailwind.config`:
  - primary blue, orange CTA, neutral grays
- Layout:
  - top navbar, content container, card grid, sticky price/summary blocks where needed
- Product card styling mimics Flipkart patterns:
  - white cards, subtle borders, shadow on hover, concise typography
- Responsive breakpoints:
  - mobile single column
  - tablet two/three columns
  - desktop four/five columns

---

## 11) Folder Structure

```txt
frontend/
  src/
    api/
    components/
    features/
      products/
      cart/
      checkout/
      orders/
    context/
    hooks/
    pages/
    utils/
    App.jsx

backend/
  src/
    config/
    controllers/
    middlewares/
    models/
    routes/
    services/
    utils/
    app.js
    server.js
  scripts/
    seed.js
```

---

## 12) Implementation Phases (2-Day Sprint)

## Phase 1 - Foundation (3-4 hrs)
- Setup frontend + backend structure
- Configure Tailwind, Axios client, environment variables
- Setup Mongo connection, base express app, error middleware
- Create schemas and seed script

## Phase 2 - Catalog (4-5 hrs)
- Build categories/products APIs
- Build listing page UI with search + filters
- Implement product detail page

## Phase 3 - Cart (2-3 hrs)
- Cart backend APIs
- Cart state context and page UI
- Quantity updates and totals

## Phase 4 - Checkout + Razorpay (4-5 hrs)
- Address form and summary UI
- Razorpay order creation + checkout modal
- Payment verification endpoint
- Order creation + confirmation page

## Phase 5 - Polish + Submission (2-3 hrs)
- Responsive tuning
- Toast + loading + empty states
- README, env docs, deployment

---

## 13) Quality, Security, and Reliability Checklist

- Validate all incoming payloads (Joi/Zod/express-validator)
- Sanitize query params for product search/filter
- Compute all monetary totals on backend only
- Verify Razorpay signatures strictly
- Handle out-of-stock edge case during checkout
- Use idempotency guard for payment verification endpoint
- Add request logging and proper error messages

---

## 14) Testing Plan

## Backend
- Unit tests for price calculations and payment signature validation
- Integration tests for:
  - products list with filters
  - cart add/update/remove
  - checkout verification and order creation

## Frontend
- Component tests for cart summary and quantity controls
- E2E sanity flow:
  - browse -> add to cart -> checkout -> confirmation

---

## 15) Environment Variables

## Backend `.env`
- `PORT=`
- `MONGODB_URI=`
- `CLIENT_URL=`
- `RAZORPAY_KEY_ID=`
- `RAZORPAY_KEY_SECRET=`
- `IMAGEKIT_PUBLIC_KEY=`
- `IMAGEKIT_PRIVATE_KEY=`
- `IMAGEKIT_URL_ENDPOINT=`

## Frontend `.env`
- `VITE_API_BASE_URL=`
- `VITE_RAZORPAY_KEY_ID=`
- `VITE_IMAGEKIT_PUBLIC_KEY=`
- `VITE_IMAGEKIT_URL_ENDPOINT=`

---

## 16) Deployment Plan

- Frontend: deploy on `Vercel`/`Netlify`
- Backend: deploy on `Render`/`Railway`
- MongoDB: `MongoDB Atlas`
- Add CORS config for deployed frontend URL
- Add Razorpay webhook URL after backend deployment

---

## 17) README Checklist

- Project overview and architecture diagram (optional but valuable)
- Setup steps for frontend/backend
- Env variable template
- Seed command
- Test command
- Deployment links (GitHub + Live URLs)
- Assumptions and trade-offs

---

## 18) Senior-Developer Execution Principles

- Build core flow first: listing -> detail -> cart -> checkout -> confirmation
- Keep strict modular boundaries between UI, API, and business logic
- Prioritize correctness of payment/order flow over extra features
- Optimize for maintainability and interview explainability
- Ship stable MVP, then add bonus features only if core is complete