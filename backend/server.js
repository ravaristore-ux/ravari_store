#!/usr/bin/env node
const Fastify = require('fastify');
const path = require('path');
const fs = require('fs');
const { Sequelize } = require('sequelize');
require('dotenv').config();

const fastify = Fastify({
  logger: true,
  bodyLimit: 1048576
});

const PORT = process.env.PORT;
const HOST = '0.0.0.0';

console.log(`[RAVARI] Initializing Fastify server`);
console.log(`[RAVARI] PORT: ${PORT}`);
console.log(`[RAVARI] HOST: ${HOST}`);

// Initialize Sequelize connection
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT || 3306,
    dialect: 'mysql',
    logging: false
  }
);

// Define Product model
const Product = sequelize.define('Product', {
  id: {
    type: require('sequelize').DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: require('sequelize').DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: require('sequelize').DataTypes.TEXT
  },
  price: {
    type: require('sequelize').DataTypes.DECIMAL(10, 2),
    allowNull: false
  },
  salePrice: {
    type: require('sequelize').DataTypes.DECIMAL(10, 2)
  },
  stock: {
    type: require('sequelize').DataTypes.INTEGER,
    defaultValue: 0
  },
  category: {
    type: require('sequelize').DataTypes.STRING
  },
  image: {
    type: require('sequelize').DataTypes.STRING
  },
  thumbnail: {
    type: require('sequelize').DataTypes.STRING
  }
}, {
  tableName: 'products',
  timestamps: true
});

// Test database connection
sequelize.authenticate()
  .then(() => console.log(`[RAVARI] ✅ Database connected successfully`))
  .catch(err => {
    console.error(`[RAVARI] ❌ Database connection failed:`, err.message);
    console.warn(`[RAVARI] ⚠️  Continuing without database, will use fallback data`);
  });

// Serve static files from React build
const buildPath = path.join(__dirname, '../frontend/build');
if (fs.existsSync(buildPath)) {
  console.log(`[RAVARI] Serving React frontend from: ${buildPath}`);
  fastify.register(require('@fastify/static'), {
    root: buildPath,
    prefix: '/'
  });
} else {
  console.log(`[RAVARI] ⚠️  React build not found at ${buildPath}`);
}

// Health check API
fastify.get('/api/health', async (request, reply) => {
  return {
    status: 'ok',
    app: 'Ravari Store',
    time: new Date().toISOString(),
    port: PORT
  };
});

// Fallback products (used if database is unavailable)
const FALLBACK_PRODUCTS = [
  { id: 1, name: 'RAVARI Premium Brown Leather Sling Bag', price: 2499, salePrice: 1999, category: 'Bags' },
  { id: 2, name: 'RAVARI Boho-Chic Leather-Trim Tote Bag', price: 3499, salePrice: 2799, category: 'Bags' },
  { id: 3, name: 'RAVARI Premium Textured Leather Handbag', price: 4999, category: 'Bags' },
  { id: 4, name: 'RAVARI Vintage Brown Leather Crossbody', price: 2299, salePrice: 1699, category: 'Bags' },
  { id: 5, name: 'RAVARI Tool Apron Premium Leather', price: 1999, salePrice: 1499, category: 'Aprons' },
  { id: 6, name: 'RAVARI Leather Document Organizer', price: 1799, category: 'Organizers' },
  { id: 7, name: 'RAVARI Leather Jewelry Box', price: 2199, salePrice: 1799, category: 'Boxes' },
  { id: 8, name: 'RAVARI Classic Brown Leather Messenger', price: 3299, salePrice: 2699, category: 'Bags' },
  { id: 9, name: 'RAVARI Leather Travel Organizer', price: 1599, salePrice: 1199, category: 'Organizers' },
  { id: 10, name: 'RAVARI Leather Wallet Collection', price: 899, salePrice: 649, category: 'Wallets' },
  { id: 11, name: 'RAVARI Designer Leather Belt', price: 1299, salePrice: 999, category: 'Belts' }
];

// Products API - fetch from database with fallback to hardcoded data
fastify.get('/api/products', async (request, reply) => {
  try {
    const products = await Product.findAll({
      attributes: ['id', 'name', 'description', 'price', 'salePrice', 'category', 'thumbnail', 'stock'],
      order: [['createdAt', 'DESC']]
    });

    if (products && products.length > 0) {
      console.log(`[RAVARI] ✅ Serving ${products.length} products from database`);
      return products;
    } else {
      console.log(`[RAVARI] ⚠️  No products found in database, using fallback data`);
      return FALLBACK_PRODUCTS;
    }
  } catch (error) {
    console.error(`[RAVARI] ❌ Error fetching products:`, error.message);
    console.log(`[RAVARI] ⚠️  Using fallback products`);
    return FALLBACK_PRODUCTS;
  }
});

// Product detail
fastify.get('/api/products/:id', async (request, reply) => {
  try {
    const productId = parseInt(request.params.id);
    const product = await Product.findByPk(productId);

    if (!product) {
      reply.code(404);
      return { error: 'Product not found' };
    }

    console.log(`[RAVARI] ✅ Serving product details for ID: ${productId}`);
    return product;
  } catch (error) {
    console.error(`[RAVARI] ❌ Error fetching product details:`, error.message);
    reply.code(500);
    return { error: 'Failed to fetch product details' };
  }
});

// SPA fallback - serve index.html for all unmatched routes
fastify.setNotFoundHandler((request, reply) => {
  const indexPath = path.join(buildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    reply.sendFile('index.html');
  } else {
    reply.code(404).send({ error: 'Not found' });
  }
});

// Start listening
fastify.listen({ port: PORT, host: HOST })
  .then(() => console.log(`[RAVARI] ✅ Listening on ${HOST}:${PORT}`))
  .catch((err) => {
    fastify.log.error(err);
    process.exit(1);
  });

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[RAVARI] SIGTERM received, shutting down...');
  fastify.close().then(() => process.exit(0));
});

process.on('SIGINT', () => {
  console.log('[RAVARI] SIGINT received, shutting down...');
  fastify.close().then(() => process.exit(0));
});
