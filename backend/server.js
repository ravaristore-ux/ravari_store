#!/usr/bin/env node

require('dotenv').config();

const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 5000;

// Simple logging
console.log('Starting server...');

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check first
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server running' });
});

// Frontend
const frontendBuild = path.join(__dirname, '../frontend/build');
if (fs.existsSync(frontendBuild)) {
  app.use(express.static(frontendBuild));
  // Serve index.html for SPA
  app.get('/', (req, res) => {
    res.sendFile(path.join(frontendBuild, 'index.html'));
  });
}

// API routes
try {
  app.use('/api/products', require('./routes/products'));
  app.use('/api/reviews', require('./routes/reviews'));
  app.use('/api/auth', require('./routes/auth'));
} catch (err) {
  console.error('Route error:', err.message);
}

// Catch-all for SPA
app.get('*', (req, res) => {
  const indexPath = path.join(frontendBuild, 'index.html');
  if (fs.existsSync(indexPath)) {
    res.sendFile(indexPath);
  } else {
    res.status(200).send('<h1>Ravari Store</h1><p>API at /api/health</p>');
  }
});

// Start server with explicit error handling
try {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
  });

  server.on('error', (err) => {
    console.error('Server error:', err);
  });
} catch (err) {
  console.error('Failed to start:', err);
  process.exit(1);
}

// Database setup in background (non-blocking)
const setupDatabase = async () => {
  try {
    const { Sequelize } = require('sequelize');
    const sequelize = new Sequelize(
      process.env.DB_NAME || 'u800235524_ravari_store',
      process.env.DB_USER || 'u800235524_ravari_user',
      process.env.DB_PASSWORD || 'Ravari@2026Secure123!',
      {
        host: process.env.DB_HOST || 'localhost',
        port: process.env.DB_PORT || 3306,
        dialect: 'mysql',
        logging: false,
        pool: { max: 5, min: 0, acquire: 3000, idle: 10000 },
        connectTimeout: 3000
      }
    );

    // Quick timeout
    await Promise.race([
      sequelize.authenticate(),
      new Promise((_, r) => setTimeout(() => r(new Error('timeout')), 3500))
    ]);

    console.log('Database connected');

    const Product = require('./models/Product');
    await sequelize.sync({ alter: true });

    const count = await Product.count();
    if (count === 0) {
      console.log('Seeding database...');
      const products = [
        { name: 'RAVARI Premium Brown Leather Sling Bag', slug: 'premium-brown-leather-sling', description: 'Elegant brown leather sling bag perfect for daily use', category: 'Leather Accessories', price: 2499, salePrice: 1999, stock: 15, material: 'Genuine Leather', color: JSON.stringify(['Brown']), size: JSON.stringify(['Medium']), thumbnail: '/images/1.png', isNew: true, isFeatured: true, careInstructions: 'Use leather conditioner monthly' },
        { name: 'RAVARI Boho-Chic Leather-Trim Tote Bag', slug: 'boho-chic-leather-tote', description: 'Stylish tote bag with leather accents', category: 'Handbags', price: 3499, salePrice: 2799, stock: 20, material: 'Canvas & Leather', color: JSON.stringify(['Beige', 'Brown']), size: JSON.stringify(['Large']), thumbnail: '/images/2.png', isNew: false, isFeatured: true, careInstructions: 'Spot clean with damp cloth' },
        { name: 'RAVARI Premium Textured Leather Handbag', slug: 'premium-textured-leather-handbag', description: 'Premium handbag with textured leather finish', category: 'Handbags', price: 4999, salePrice: null, stock: 10, material: 'Premium Leather', color: JSON.stringify(['Black', 'Brown', 'Cognac']), size: JSON.stringify(['Medium', 'Large']), thumbnail: '/images/3.png', isNew: true, isFeatured: true, careInstructions: 'Professional cleaning recommended' },
        { name: 'RAVARI Vintage Brown Leather Crossbody', slug: 'vintage-brown-leather-crossbody', description: 'Vintage-inspired leather crossbody bag', category: 'Leather Accessories', price: 2299, salePrice: 1699, stock: 12, material: 'Vintage Leather', color: JSON.stringify(['Brown']), size: JSON.stringify(['Small']), thumbnail: '/images/4.png', isNew: false, isFeatured: false, careInstructions: 'Hand wash recommended' },
        { name: 'RAVARI Tool Apron Premium Leather', slug: 'tool-apron-premium-leather', description: 'Durable leather work apron with multiple pockets', category: 'Leather Organizers', price: 1999, salePrice: 1499, stock: 25, material: 'Heavy Duty Leather', color: JSON.stringify(['Tan', 'Brown']), size: JSON.stringify(['One Size']), thumbnail: '/images/5.png', isNew: true, isFeatured: false, careInstructions: 'Oil occasionally for durability' },
        { name: 'RAVARI Leather Document Organizer', slug: 'leather-document-organizer', description: 'Elegant leather organizer for documents and accessories', category: 'Leather Organizers', price: 1799, salePrice: null, stock: 18, material: 'Genuine Leather', color: JSON.stringify(['Brown', 'Black']), size: JSON.stringify(['Standard']), thumbnail: '/images/6.png', isNew: false, isFeatured: true, careInstructions: 'Dust with soft cloth regularly' },
        { name: 'RAVARI Leather Jewelry Box', slug: 'leather-jewelry-box', description: 'Luxurious leather jewelry organizer box', category: 'Leather Organizers', price: 2199, salePrice: 1799, stock: 14, material: 'Premium Leather', color: JSON.stringify(['Black', 'Brown']), size: JSON.stringify(['Medium']), thumbnail: '/images/7.png', isNew: true, isFeatured: false, careInstructions: 'Keep away from direct sunlight' },
        { name: 'RAVARI Classic Brown Leather Messenger', slug: 'classic-brown-leather-messenger', description: 'Classic messenger bag in rich brown leather', category: 'Handbags', price: 3299, salePrice: 2699, stock: 11, material: 'Full Grain Leather', color: JSON.stringify(['Brown']), size: JSON.stringify(['Large']), thumbnail: '/images/8.png', isNew: false, isFeatured: true, careInstructions: 'Condition every 6 months' },
        { name: 'RAVARI Leather Travel Organizer', slug: 'leather-travel-organizer', description: 'Compact travel organizer for documents and valuables', category: 'Leather Accessories', price: 1599, salePrice: 1199, stock: 16, material: 'Travel Grade Leather', color: JSON.stringify(['Brown', 'Black']), size: JSON.stringify(['Compact']), thumbnail: '/images/9.png', isNew: true, isFeatured: false, careInstructions: 'Wipe with dry cloth after use' },
        { name: 'RAVARI Leather Wallet Collection', slug: 'leather-wallet-collection', description: 'Premium leather wallet with multiple card slots', category: 'Leather Accessories', price: 899, salePrice: 649, stock: 30, material: 'Nappa Leather', color: JSON.stringify(['Brown', 'Black', 'Tan']), size: JSON.stringify(['Standard']), thumbnail: '/images/10.png', isNew: false, isFeatured: true, careInstructions: 'Avoid excessive moisture' },
        { name: 'RAVARI Designer Leather Belt', slug: 'designer-leather-belt', description: 'Premium designer leather belt with brass buckle', category: 'Leather Accessories', price: 1299, salePrice: 999, stock: 22, material: 'Italian Leather', color: JSON.stringify(['Brown', 'Black']), size: JSON.stringify(['28-38 inches']), thumbnail: '/images/11.png', isNew: true, isFeatured: false, careInstructions: 'Clean with leather cleaner' }
      ];
      await Product.bulkCreate(products);
      console.log('Database seeded');
    } else {
      console.log(`Database ready with ${count} products`);
    }
  } catch (err) {
    console.log('Database setup skipped:', err.message);
  }
};

// Start database setup without blocking
setupDatabase();
