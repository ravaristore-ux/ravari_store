# Local Development Setup Guide

Complete step-by-step guide to run Ravari e-commerce locally.

## Prerequisites

- **Node.js** v16+ (Download from https://nodejs.org/)
- **MongoDB** (Local or MongoDB Atlas - Free cloud option)
- **Git** (Optional, for cloning)
- A text editor or IDE (VS Code recommended)

## Step 1: MongoDB Setup

### Option A: Local MongoDB (Recommended for Development)

**On macOS:**
```bash
# Install MongoDB using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB service
brew services start mongodb-community

# Check if running
mongo --version
```

**On Windows:**
- Download from https://www.mongodb.com/try/download/community
- Run installer and follow setup wizard
- MongoDB will run as a service automatically

**On Linux:**
```bash
# Ubuntu/Debian
sudo apt-get install -y mongodb
sudo systemctl start mongodb
```

### Option B: MongoDB Atlas (Cloud - Free)

1. Visit https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create new cluster
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/ravari`

## Step 2: Backend Setup

```bash
# Navigate to backend
cd ravari-redesign/backend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env with your settings
nano .env  # or open in your editor
```

### .env Configuration:
```
MONGODB_URI=mongodb://localhost:27017/ravari
JWT_SECRET=your-super-secret-key-change-this
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### Seed Database (Optional - Load Sample Data)

```bash
# Run seeder to populate sample products and users
node scripts/seedData.js
```

**Demo Credentials:**
- Admin: `admin@ravari.in` / `admin123`
- Customer: `customer@ravari.in` / `customer123`

### Start Backend Server

```bash
# Install nodemon globally (optional for auto-restart)
npm install -g nodemon

# Start server (development mode)
npm run dev

# OR start without auto-restart
npm start
```

**Output should show:**
```
🚀 Server running on port 5000
✅ MongoDB connected
🔗 API URL: http://localhost:5000/api
✅ Health check: http://localhost:5000/api/health
```

Test API: http://localhost:5000/api/health

## Step 3: Frontend Setup

```bash
# Navigate to frontend
cd ravari-redesign/frontend

# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env
nano .env  # or open in your editor
```

### .env Configuration:
```
REACT_APP_API_URL=http://localhost:5000/api
REACT_APP_STRIPE_PUBLIC_KEY=pk_test_xxx  # Add later
REACT_APP_RAZORPAY_KEY=your_key_here     # Add later
```

### Start Frontend Server

```bash
npm start
```

**Browser should auto-open:** http://localhost:3000

## Step 4: Verify Everything Works

### Test URLs

**Frontend:**
- Home: http://localhost:3000
- Shop: http://localhost:3000/products
- Cart: http://localhost:3000/cart

**Backend API:**
- Health: http://localhost:5000/api/health
- Products: http://localhost:5000/api/products
- Categories: http://localhost:5000/api/products/categories/list

## Troubleshooting

### MongoDB Connection Error
```
Error: connect ECONNREFUSED 127.0.0.1:27017
```
**Solution:**
- Ensure MongoDB is running: `sudo systemctl status mongodb`
- Check connection string in .env matches your setup
- If using MongoDB Atlas, ensure IP whitelist includes your computer

### Port Already in Use
```
Error: listen EADDRINUSE :::5000
```
**Solution:**
```bash
# Find and kill process using port 5000
lsof -i :5000
kill -9 <PID>

# OR change PORT in .env
PORT=5001
```

### CORS Errors
```
Access to XMLHttpRequest blocked by CORS
```
**Solution:**
- Ensure FRONTEND_URL in backend .env is correct
- Should be: `http://localhost:3000`
- Check backend CORS configuration in server.js

### React App Won't Start
```
npm ERR! code ERESOLVE
```
**Solution:**
```bash
npm install --legacy-peer-deps
npm start
```

## Development Workflow

### Making Changes

**Backend Changes:**
1. Edit files in `/backend`
2. Server auto-restarts if using `npm run dev`
3. Test with API client (Postman, Thunder Client, etc.)

**Frontend Changes:**
1. Edit files in `/frontend/src`
2. Browser auto-refreshes on save
3. Check console for errors

### Testing API Endpoints

**Using cURL:**
```bash
# Get all products
curl http://localhost:5000/api/products

# Get featured products
curl http://localhost:5000/api/products/featured

# Login
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@ravari.in","password":"admin123"}'
```

**Using Postman:**
1. Download https://www.postman.com/downloads/
2. Create requests for all endpoints
3. Save collection for later

## Adding Products via Scraper

```bash
# In backend directory
node scrapers/ravaryScraper.js
```

Or via API (if admin):
1. Get JWT token by logging in as admin
2. POST to `http://localhost:5000/api/admin/products`
3. Include products with images

## Database Management

### View Database

```bash
# Connect to MongoDB
mongo

# List databases
show dbs

# Use ravari database
use ravari

# List collections
show collections

# View products
db.products.find()

# Count documents
db.products.count()
```

### Reset Database

```bash
# Delete all data
mongo
use ravari
db.dropDatabase()

# Reseed with sample data
node scripts/seedData.js
```

## Frontend Login Test

1. Go to http://localhost:3000/account
2. Create new account OR use seeded credentials
3. Try adding products to cart
4. Navigate through site

## Next Steps

After local testing works:
1. ✅ Test all features
2. ✅ Check mobile responsiveness
3. ✅ Load test with sample data
4. ✅ Review console for errors
5. ✅ Proceed to Hostinger deployment (see DEPLOYMENT.md)

## Useful Commands

```bash
# Clear npm cache
npm cache clean --force

# List global packages
npm list -g

# Update npm
npm install -g npm@latest

# Check Node version
node --version

# Check npm version
npm --version

# Remove node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

## Performance Tips

1. Use MongoDB indexing for faster queries
2. Enable gzip compression in nginx
3. Minify assets for production
4. Use CDN for image delivery
5. Set appropriate caching headers

## Security Notes

⚠️ **Never commit .env files to git!**

Add to `.gitignore`:
```
.env
.env.local
.env.*.local
node_modules/
```

Keep `JWT_SECRET` secure and unique.

---

**Need help?** Check console errors first - they usually indicate the problem!
