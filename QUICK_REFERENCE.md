# Quick Reference Guide

Fast lookup for common tasks and commands.

## Starting Everything Locally

### Terminal 1 - MongoDB
```bash
# macOS
brew services start mongodb-community

# Linux
sudo systemctl start mongodb

# Windows - Auto-starts as service
```

### Terminal 2 - Backend
```bash
cd ravari-redesign/backend
npm install      # First time only
npm run dev
```

### Terminal 3 - Frontend
```bash
cd ravari-redesign/frontend
npm install      # First time only
npm start
```

**All running?**
- Backend: http://localhost:5000/api/health
- Frontend: http://localhost:3000
- API: http://localhost:5000/api/products

## Seeding Database

```bash
cd backend
npm install
node scripts/seedData.js

# Creates:
# - 5 sample products
# - Admin user: admin@ravari.in / admin123
# - Customer user: customer@ravari.in / customer123
```

## API Testing Examples

### Using cURL

**Get Products**
```bash
curl http://localhost:5000/api/products
```

**Login**
```bash
curl -X POST http://localhost:5000/api/users/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@ravari.in",
    "password": "admin123"
  }'
```

**Create Product (requires admin token)**
```bash
curl -X POST http://localhost:5000/api/products \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "New Product",
    "slug": "new-product",
    "category": "Wallets",
    "price": 1999,
    "stock": 10
  }'
```

## Common Fixes

### Port Already in Use
```bash
# Find what's using port
lsof -i :5000  # or :3000

# Kill process
kill -9 <PID>

# Or change port in .env
PORT=5001
```

### MongoDB Connection Error
```bash
# Check if running
ps aux | grep mongod

# Start if not running
sudo systemctl start mongodb
```

### Module Not Found
```bash
# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

### React App Won't Start
```bash
# Use legacy peer deps
npm install --legacy-peer-deps
npm start
```

## Environment Variables

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/ravari
JWT_SECRET=any-random-secret-key
NODE_ENV=development
PORT=5000
FRONTEND_URL=http://localhost:3000
```

### Frontend (.env)
```
REACT_APP_API_URL=http://localhost:5000/api
```

## File Locations

**Backend Server:** `/backend/server.js`
**Backend Routes:** `/backend/routes/*.js`
**Frontend App:** `/frontend/src/App.js`
**Frontend Pages:** `/frontend/src/pages/*.js`
**Database Models:** `/backend/models/*.js`
**Redux Store:** `/frontend/src/redux/store.js`

## Database Commands

```bash
# Connect to MongoDB
mongo

# Use Ravari database
use ravari

# View all products
db.products.find()

# Count products
db.products.count()

# View specific product
db.products.findOne({ name: "Premium Leather Wallet" })

# Delete all products
db.products.deleteMany({})

# Exit
exit
```

## Package Management

```bash
# Update all packages
npm update

# Check outdated packages
npm outdated

# Check for vulnerabilities
npm audit

# Fix vulnerabilities
npm audit fix

# View package size
npm ls

# Globally installed
npm list -g
```

## Git Commands

```bash
# Initialize repo
git init

# Check status
git status

# Add changes
git add .

# Commit
git commit -m "message"

# Push
git push origin main

# Pull
git pull

# Create branch
git checkout -b feature-name

# Switch branch
git checkout main
```

## Frontend Development

### Add New Page
1. Create file: `/frontend/src/pages/YourPage.js`
2. Add component code
3. Import in `/frontend/src/App.js`
4. Add route: `<Route path="/your-page" element={<YourPage />} />`

### Add New Component
1. Create: `/frontend/src/components/YourComponent.js`
2. Import in needed pages
3. Use: `<YourComponent prop={value} />`

### Add Redux State
1. Create slice: `/frontend/src/redux/slices/yourSlice.js`
2. Add to store in `store.js`
3. Use in component: `useSelector(state => state.yourSlice.data)`

### Update Styles
- Global: `/frontend/src/styles/globals.css`
- Tailwind: Modify classes in JSX directly
- Tailwind config: `/frontend/tailwind.config.js`

## Backend Development

### Add New API Route
1. Create controller in `/backend/controllers/`
2. Create/update route in `/backend/routes/`
3. Add route to `server.js`: `app.use('/api/path', require('./routes/path'))`

### Add Database Model
1. Create in `/backend/models/YourModel.js`
2. Export: `module.exports = mongoose.model('YourModel', schema)`
3. Import in controller: `const YourModel = require('../models/YourModel')`

### Add Authentication
1. Import middleware: `const { auth, adminAuth } = require('../middleware/auth')`
2. Add to route: `router.get('/', auth, controllerFunction)`
3. Access user ID in controller: `req.userId`

## Debugging

### Browser Console (Frontend)
```
F12 or Ctrl+Shift+I
```

### Browser Network Tab
- Check API calls
- View response headers
- Check status codes (200=OK, 401=Unauthorized, 500=Error)

### Backend Logs
```bash
# If using npm run dev (with nodemon)
# Logs show automatically

# Manual logging
console.log("Debug:", variable)
console.error("Error:", error)

# View logs file
tail -f logs.txt
```

### MongoDB Logs
```bash
tail -f /var/log/mongodb/mongod.log
```

## Performance Tips

1. Use async/await for cleaner code
2. Add indexes to frequently queried fields
3. Use pagination for large datasets
4. Minify images before uploading
5. Cache API responses in Redux
6. Use React.memo for expensive components
7. Code split large pages
8. Use CDN for static assets

## Security Reminders

⚠️ **NEVER:**
- Commit .env files
- Expose API keys in frontend
- Use simple passwords
- Skip password hashing
- Disable CORS completely
- Log sensitive data

✅ **DO:**
- Use environment variables for secrets
- Validate all inputs
- Hash passwords with bcrypt
- Use JWT for auth
- Check user permissions
- Use HTTPS in production
- Regular security audits

## Testing Workflows

### Frontend Feature Testing
1. Add feature in component
2. Update Redux if needed
3. Test in browser at localhost:3000
4. Check Console for errors
5. Check Network tab for API calls

### Backend API Testing
1. Update controller
2. Add/update route
3. Test with cURL or Postman
4. Check logs for errors
5. Verify database changes

### End-to-End Testing
1. Start both servers
2. Test user flow:
   - Register → Login → Browse → Add to Cart → Checkout
3. Check database for order
4. Verify frontend state
5. Confirm API logs

## Deployment Checklist

Before deploying to Hostinger:
- [ ] All features work locally
- [ ] No console errors
- [ ] No API errors
- [ ] Database seeded with products
- [ ] .env configured for production
- [ ] API keys secured
- [ ] Frontend built: `npm run build`
- [ ] All dependencies installed: `npm install --production`
- [ ] Git committed and ready

## Useful Links

- **Node.js Docs:** https://nodejs.org/docs/
- **Express Docs:** https://expressjs.com/
- **React Docs:** https://react.dev/
- **MongoDB Docs:** https://docs.mongodb.com/
- **Tailwind Docs:** https://tailwindcss.com/docs/
- **Redux Docs:** https://redux.js.org/

## Getting Help

1. Check error message carefully
2. Google the error
3. Check Console (F12)
4. Check Backend Logs
5. Check Database state
6. Review code changes
7. Try restarting servers

---

**Quick Start:** 
```bash
# Terminal 1
npm run dev  # in backend

# Terminal 2
npm start    # in frontend

# Seed database once
node scripts/seedData.js
```

**Testing:** http://localhost:3000
**API:** http://localhost:5000/api
