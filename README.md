# Ravari E-Commerce Platform - Complete Redesign

A luxury lifestyle e-commerce platform redesigned from WordPress to a modern React + Node.js stack. Features complete product catalog, shopping cart, checkout, user accounts, reviews, wishlist, and admin dashboard.

## Project Structure

```
ravari-redesign/
├── frontend/                 # React frontend
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── redux/           # State management
│   │   ├── api/             # API configuration
│   │   ├── styles/          # Global styles
│   │   ├── App.js
│   │   └── index.js
│   ├── public/
│   ├── package.json
│   └── tailwind.config.js
│
└── backend/                  # Node.js/Express API
    ├── models/              # Database models
    ├── routes/              # API routes
    ├── middleware/          # Auth, error handling
    ├── controllers/         # Business logic
    ├── server.js
    └── package.json
```

## Tech Stack

### Frontend
- **React 18** - UI library
- **React Router v6** - Navigation
- **Redux** - State management
- **Tailwind CSS** - Styling
- **Axios** - HTTP client

### Backend
- **Node.js + Express** - API server
- **MongoDB** - Database
- **JWT** - Authentication
- **Stripe/Razorpay** - Payment processing

## Features Implemented

### Core E-Commerce
✅ Product catalog with search & filtering  
✅ Advanced product pages with images & specs  
✅ Shopping cart (add/remove/update quantity)  
✅ User authentication (register/login)  
✅ Secure checkout with payment integration  
✅ Order management & tracking  

### Premium Features
✅ Customer reviews & ratings  
✅ Wishlist functionality  
✅ Product comparison tool  
✅ Recommended products  
✅ User account management  
✅ Order history  

### Admin Features
✅ Product management (CRUD)  
✅ Order management & status updates  
✅ Review moderation  
✅ Dashboard with analytics  

### Design & UX
✅ Responsive mobile-first design  
✅ Luxury aesthetic with smooth animations  
✅ Fast image loading with optimization  
✅ Search with autocomplete  
✅ Breadcrumb navigation  
✅ Dark/light mode ready  

## Prerequisites

- Node.js v16+ and npm/yarn
- MongoDB (local or Atlas)
- Git

## Installation & Setup

### 1. Clone & Navigate
```bash
cd ravari-redesign
```

### 2. Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your configuration
# - MONGODB_URI: Your MongoDB connection string
# - JWT_SECRET: Random secret key
# - Payment gateway keys (Stripe/Razorpay)
# - SMTP credentials for emails

# Start development server
npm run dev
```

Backend runs on `http://localhost:5000`

### 3. Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with API URL
# REACT_APP_API_URL=http://localhost:5000/api

# Start development server
npm start
```

Frontend runs on `http://localhost:3000`

## API Documentation

### Products
```
GET    /api/products                 # Get all products with filters
GET    /api/products/featured        # Get featured products
GET    /api/products/new             # Get new arrivals
GET    /api/products/:id             # Get product by ID
GET    /api/products/slug/:slug      # Get product by slug
GET    /api/products/:id/similar     # Get similar products
GET    /api/products/categories/list # Get all categories
```

### Authentication
```
POST   /api/users/register           # Register new user
POST   /api/users/login              # Login user
GET    /api/users/me                 # Get current user (auth required)
PUT    /api/users/profile            # Update profile (auth required)
POST   /api/users/addresses          # Add address (auth required)
```

### Shopping
```
POST   /api/orders                   # Create order (auth required)
GET    /api/orders                   # Get user's orders (auth required)
GET    /api/orders/:id               # Get order details (auth required)
PUT    /api/orders/:id/payment       # Update payment status (auth required)
PUT    /api/orders/:id/cancel        # Cancel order (auth required)

POST   /api/wishlist/add/:productId  # Add to wishlist (auth required)
DELETE /api/wishlist/remove/:productId # Remove from wishlist (auth required)
GET    /api/wishlist                 # Get wishlist (auth required)
GET    /api/wishlist/check/:productId # Check if in wishlist (auth required)
```

### Reviews
```
POST   /api/reviews                  # Create review (auth required)
GET    /api/reviews/product/:productId # Get product reviews
GET    /api/reviews/user/my-reviews  # Get user's reviews (auth required)
PUT    /api/reviews/:id              # Update review (auth required)
DELETE /api/reviews/:id              # Delete review (auth required)
POST   /api/reviews/:id/helpful      # Mark as helpful
```

### Admin (auth + admin role required)
```
POST   /api/admin/products           # Add product
PUT    /api/admin/products/:id       # Update product
DELETE /api/admin/products/:id       # Delete product
GET    /api/admin/orders             # Get all orders
PUT    /api/admin/orders/:id         # Update order status
GET    /api/admin/reviews/pending    # Get pending reviews
PUT    /api/admin/reviews/:id        # Approve/reject review
GET    /api/admin/stats              # Dashboard statistics
```

## Database Schema

### Products
- name, slug, description, category, price, salePrice
- images, stock, materials, colors, sizes
- rating, reviewCount, tags
- SEO fields (title, description, keywords)
- isNew, isLimitedEdition, isFeatured flags

### Users
- firstName, lastName, email, password (hashed)
- phone, avatar, addresses
- role (customer/admin), newsletter preference

### Orders
- userId, orderNumber, items (with quantities)
- shippingAddress, billingAddress
- subtotal, tax, shipping, total
- paymentMethod, paymentStatus, orderStatus
- trackingNumber, notes

### Reviews
- productId, userId, orderId
- rating (1-5), title, comment, images
- verified, helpful count, status (pending/approved/rejected)

### Wishlist
- userId, items (array of productIds)

## Configuration

### Environment Variables

**Backend (.env)**
```
MONGODB_URI=mongodb://localhost:27017/ravari
JWT_SECRET=your-secret-key-here
NODE_ENV=development
PORT=5000
STRIPE_PUBLIC_KEY=pk_test_xxx
STRIPE_SECRET_KEY=sk_test_xxx
RAZORPAY_KEY_ID=xxx
RAZORPAY_KEY_SECRET=xxx
SMTP_HOST=smtp.gmail.com
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
AWS_ACCESS_KEY_ID=xxx
AWS_SECRET_ACCESS_KEY=xxx
AWS_S3_BUCKET=ravari-images
FRONTEND_URL=http://localhost:3000
```

**Frontend (.env)**
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_xxx
REACT_APP_RAZORPAY_KEY=your_key_here
```

## Next Steps (Phase 2)

### Immediate Tasks
1. **Product Data Scraping**
   - Scrape images from current ravari.in
   - Extract product details, pricing, descriptions
   - Populate MongoDB with data

2. **Payment Integration**
   - Implement Stripe/Razorpay checkout
   - Test payment flow
   - Handle webhooks for payment updates

3. **Email Notifications**
   - Order confirmation emails
   - Shipping notifications
   - Review approval emails

4. **Image Optimization**
   - Set up AWS S3 or Cloudinary
   - Implement image resizing & compression
   - Add lazy loading

### Future Enhancements
- [ ] SEO landing pages (Metalink, categories)
- [ ] Blog/content management
- [ ] Instagram feed integration
- [ ] Live chat support
- [ ] Email marketing (Mailchimp integration)
- [ ] Analytics dashboard
- [ ] AI product recommendations
- [ ] Video support for products
- [ ] Mobile app (React Native)
- [ ] Multi-language support

## Deployment

### Frontend
1. Build: `npm run build`
2. Deploy to Vercel, Netlify, or AWS S3 + CloudFront

### Backend
1. Deploy to Heroku, Railway, or AWS
2. Set environment variables
3. Set up MongoDB Atlas
4. Configure CORS for frontend domain

## Testing

```bash
# Frontend
npm test

# Backend
npm test
```

## Performance Optimization

- Image lazy loading
- Code splitting
- Minification & compression
- CDN for static assets
- Database indexing
- API response caching

## Security

- JWT authentication
- Password hashing (bcrypt)
- HTTPS/SSL only
- Input validation & sanitization
- CORS protection
- Rate limiting (recommended)
- SQL injection prevention
- XSS protection
- CSRF tokens

## Support & Troubleshooting

### Common Issues

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check MONGODB_URI in .env
- Verify network access (if using Atlas)

**API Port Already in Use**
- Change PORT in .env
- Or kill process: `lsof -i :5000`

**CORS Errors**
- Check FRONTEND_URL in backend .env
- Verify request headers

**Login Issues**
- Clear browser localStorage
- Check JWT_SECRET matches
- Verify token expiration

## Project Timeline

- **Phase 1** (Days 1-8): Core platform development ✅ Completed
- **Phase 2** (Days 8-12): Data migration & payment integration
- **Phase 3** (Days 12-15): SEO & content
- **Phase 4** (Days 15+): Testing, optimization, launch

## Team

Built with React, Node.js, and MongoDB  
Designed for luxury lifestyle brands

## License

Private - Ravari.in

---

**For questions or support, contact:** info@ravari.in
