require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { Sequelize } = require('sequelize');
const path = require('path');
const fs = require('fs');

const app = express();

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || '*',
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Static files - Frontend build
const frontendBuild = path.join(__dirname, '../frontend/build');

// Check if frontend build exists, if not create a simple fallback
if (fs.existsSync(frontendBuild)) {
  app.use(express.static(frontendBuild));
} else {
  console.log('⚠️  Frontend build not found, will serve from public...');
  app.use(express.static(path.join(__dirname, 'public')));
}

// Product images
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Database Connection - Try MySQL first, fallback to MongoDB
let dbConnected = false;
let sequelize = null;

// Try MySQL Connection via Sequelize first
if (process.env.DB_HOST || process.env.NODE_ENV === 'production') {
  console.log('🔄 Attempting MySQL connection...');
  const { Sequelize: Seq } = require('sequelize');
  sequelize = new Seq(
    process.env.DB_NAME || 'u800235524_ravari_store',
    process.env.DB_USER || 'u800235524_ravari_user',
    process.env.DB_PASSWORD || 'Ravari@2026Secure123!',
    {
      host: process.env.DB_HOST || 'localhost',
      port: process.env.DB_PORT || 3306,
      dialect: 'mysql',
      logging: false,
      pool: { max: 5, min: 0, acquire: 30000, idle: 10000 },
      connectTimeout: 3000
    }
  );

  // Connect in background with timeout
  const dbTimeout = new Promise((resolve, reject) => {
    setTimeout(() => reject(new Error('Database connection timeout')), 3500);
  });

  Promise.race([sequelize.authenticate(), dbTimeout])
    .then(() => {
      console.log('✅ MySQL connected');
      dbConnected = true;
      return sequelize.sync({ alter: true });
    })
    .catch(err => {
      console.warn('⚠️  MySQL connection failed:', err.message);
      console.warn('App will continue without database. Frontend will load.');
      sequelize = null;
    });

  global.sequelize = sequelize;
} else {
  // Development: Try MongoDB first
  initMongoDB();
}

function initMongoDB() {
  const mongoose = require('mongoose');
  console.log('🔄 Attempting MongoDB connection...');
  mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ravari', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log('✅ MongoDB connected');
    dbConnected = true;
  })
  .catch(err => {
    console.error('❌ Database error (both MySQL and MongoDB failed):', err.message);
    console.error('⚠️  Starting server without database - API will return placeholder data');
  });
}

// Routes
app.use('/api/products', require('./routes/products'));
app.use('/api/reviews', require('./routes/reviews'));
app.use('/api/auth', require('./routes/auth'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Ravari API is running' });
});

// Serve React app for all non-API routes (SPA fallback)
app.get('*', (req, res) => {
  const indexPath = path.join(frontendBuild, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    // Fallback response if no frontend build
    res.send('<h1>Ravari API Server</h1><p>Frontend build not available. API endpoints are functional.</p>');
  }
});

// Error handling
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Ravari backend running on port ${PORT}`);
});
