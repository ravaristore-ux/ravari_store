#!/usr/bin/env node
const Fastify = require('fastify');
const path = require('path');
const fs = require('fs');

const fastify = Fastify({ logger: true, bodyLimit: 1048576 });

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

console.log(`[RAVARI] Starting server on ${HOST}:${PORT}`);

// ---------------------------------------------------------------------------
// Product catalogue (source of truth used to seed DB + as live fallback)
// ---------------------------------------------------------------------------
const PRODUCTS = [
  { id: 1,  name: 'RAVARI Premium Brown Leather Sling Bag', price: 2499, salePrice: 1999, category: 'Bags', thumbnail: '/images/1 (3).png', description: 'Elegant brown leather sling bag for everyday luxury.', stock: 15 },
  { id: 2,  name: 'RAVARI Boho-Chic Leather-Trim Tote Bag', price: 3499, salePrice: 2799, category: 'Bags', thumbnail: '/images/2 (3).png', description: 'Spacious boho-chic tote with premium leather trim.', stock: 12 },
  { id: 3,  name: 'RAVARI Premium Textured Leather Handbag', price: 4999, salePrice: null, category: 'Bags', thumbnail: '/images/3.png', description: 'Statement textured-leather handbag.', stock: 8 },
  { id: 4,  name: 'RAVARI Vintage Brown Leather Crossbody', price: 2299, salePrice: 1699, category: 'Bags', thumbnail: '/images/4 (3).png', description: 'Vintage-inspired crossbody in rich brown leather.', stock: 20 },
  { id: 5,  name: 'RAVARI Tool Apron Premium Leather', price: 1999, salePrice: 1499, category: 'Aprons', thumbnail: '/images/5.png', description: 'Durable premium-leather tool apron.', stock: 25 },
  { id: 6,  name: 'RAVARI Leather Document Organizer', price: 1799, salePrice: null, category: 'Organizers', thumbnail: '/images/6.png', description: 'Keep documents elegant and organized.', stock: 18 },
  { id: 7,  name: 'RAVARI Leather Jewelry Box', price: 2199, salePrice: 1799, category: 'Boxes', thumbnail: '/images/7.png', description: 'Handcrafted leather jewelry box.', stock: 10 },
  { id: 8,  name: 'RAVARI Classic Brown Leather Messenger', price: 3299, salePrice: 2699, category: 'Bags', thumbnail: '/images/8.png', description: 'Classic messenger bag for work and travel.', stock: 14 },
  { id: 9,  name: 'RAVARI Leather Travel Organizer', price: 1599, salePrice: 1199, category: 'Organizers', thumbnail: '/images/9.png', description: 'Compact travel organizer in fine leather.', stock: 22 },
  { id: 10, name: 'RAVARI Leather Wallet Collection', price: 899, salePrice: 649, category: 'Wallets', thumbnail: '/images/10.png', description: 'Slim, refined leather wallet.', stock: 40 },
  { id: 11, name: 'RAVARI Designer Leather Belt', price: 1299, salePrice: 999, category: 'Belts', thumbnail: '/images/11.png', description: 'Designer leather belt with signature buckle.', stock: 30 }
];

// ---------------------------------------------------------------------------
// Database (best-effort: never blocks or crashes the server)
// ---------------------------------------------------------------------------
let Product = null;
let dbReady = false;
let dbError = null;
let dbHostUsed = null;
let dbDiag = null;

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function tryConnect(target) {
  const { Sequelize, DataTypes } = require('sequelize');
  // target can be { host, port } for TCP or { socketPath } for unix socket
  const conn = target.socketPath
    ? { dialectOptions: { socketPath: target.socketPath } }
    : { host: target.host, port: target.port || 3306, dialectOptions: { connectTimeout: 15000 } };

  const sequelize = new Sequelize(
    process.env.DB_NAME || 'u800235524_ravari_store',
    process.env.DB_USER || 'u800235524_ravari_user',
    process.env.DB_PASSWORD || 'Ravari@2026Secure123!',
    {
      dialect: 'mysql',
      logging: false,
      pool: { max: 5, min: 0, acquire: 15000, idle: 10000 },
      ...conn
    }
  );

  const model = sequelize.define('Product', {
    id:          { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
    name:        { type: DataTypes.STRING, allowNull: false },
    description: { type: DataTypes.TEXT },
    price:       { type: DataTypes.DECIMAL(10, 2), allowNull: false },
    salePrice:   { type: DataTypes.DECIMAL(10, 2) },
    stock:       { type: DataTypes.INTEGER, defaultValue: 0 },
    category:    { type: DataTypes.STRING },
    thumbnail:   { type: DataTypes.STRING }
  }, { tableName: 'products', timestamps: true });

  await sequelize.authenticate();
  await sequelize.sync();
  const count = await model.count();
  if (count === 0) {
    await model.bulkCreate(PRODUCTS);
    console.log('[RAVARI] ✅ Seeded 11 products');
  } else {
    console.log(`[RAVARI] ✅ ${count} products already in database`);
  }
  return model;
}

// Bound any single attempt so a filtered TCP port can never hang the loop
function withTimeout(promise, ms, label) {
  return Promise.race([
    promise,
    new Promise((_, rej) => setTimeout(() => rej(new Error(`timeout(${label})`)), ms))
  ]);
}

// Raw mysql2 diagnostic — captures the exact syscall/path behind EEXIST
async function rawDiag() {
  const results = [];
  let mysql;
  try { mysql = require('mysql2/promise'); }
  catch (e) { return [{ step: 'require mysql2', code: e.code, msg: e.message }]; }

  const cfgs = [
    { name: 'env-host', opts: { host: process.env.DB_HOST || 'localhost', user: process.env.DB_USER || 'u800235524_ravari_user', password: process.env.DB_PASSWORD || 'Ravari@2026Secure123!', database: process.env.DB_NAME || 'u800235524_ravari_store', connectTimeout: 5000 } },
    { name: 'tcp-127', opts: { host: '127.0.0.1', port: 3306, user: process.env.DB_USER || 'u800235524_ravari_user', password: process.env.DB_PASSWORD || 'Ravari@2026Secure123!', database: process.env.DB_NAME || 'u800235524_ravari_store', connectTimeout: 5000 } }
  ];
  for (const c of cfgs) {
    try {
      const conn = await mysql.createConnection(c.opts);
      await conn.query('SELECT 1');
      await conn.end();
      results.push({ name: c.name, ok: true });
    } catch (e) {
      results.push({ name: c.name, ok: false, code: e.code, errno: e.errno, syscall: e.syscall, path: e.path, msg: e.message });
    }
  }
  return results;
}

async function initDatabase() {
  try {
    dbDiag = await rawDiag();
    console.log('[RAVARI] rawDiag:', JSON.stringify(dbDiag));
  } catch (e) {
    dbDiag = [{ step: 'rawDiag threw', msg: e.message }];
  }

  const targets = [
    process.env.DB_HOST ? { host: process.env.DB_HOST, label: `env:${process.env.DB_HOST}` } : null,
    { socketPath: '/var/run/mysqld/mysqld.sock', label: 'sock:/var/run/mysqld/mysqld.sock' },
    { socketPath: '/run/mysqld/mysqld.sock', label: 'sock:/run/mysqld/mysqld.sock' },
    { socketPath: '/tmp/mysql.sock', label: 'sock:/tmp/mysql.sock' },
    { socketPath: '/var/lib/mysql/mysql.sock', label: 'sock:/var/lib/mysql/mysql.sock' },
    { host: '127.0.0.1', label: 'tcp:127.0.0.1' },
    { host: 'localhost', label: 'tcp:localhost' }
  ].filter(Boolean);

  const errors = [];
  for (let attempt = 1; attempt <= 3; attempt++) {
    for (const t of targets) {
      try {
        console.log(`[RAVARI] DB attempt ${attempt} via ${t.label}...`);
        Product = await withTimeout(tryConnect(t), 6000, t.label);
        dbReady = true;
        dbError = null;
        dbHostUsed = t.label;
        console.log(`[RAVARI] ✅ Database connected via ${t.label}`);
        return;
      } catch (err) {
        const msg = `${t.label}:${err.code || ''} ${err.message}`;
        errors.push(msg);
        console.error(`[RAVARI] ⚠️  DB failed ${msg}`);
      }
    }
    dbError = errors.slice(-7).join(' | '); // update after each round
    await sleep(2000);
  }
  console.error('[RAVARI] ⚠️  All DB attempts failed, using fallback data');
}

// ---------------------------------------------------------------------------
// Static React frontend
// ---------------------------------------------------------------------------
const buildPath = path.join(__dirname, '../frontend/build');
if (fs.existsSync(path.join(buildPath, 'index.html'))) {
  console.log(`[RAVARI] Serving React frontend from ${buildPath}`);
  fastify.register(require('@fastify/static'), { root: buildPath, prefix: '/' });
} else {
  console.log(`[RAVARI] ⚠️  React build not found at ${buildPath}`);
}

// ---------------------------------------------------------------------------
// API routes
// ---------------------------------------------------------------------------
fastify.get('/api/health', async () => ({
  status: 'ok',
  app: 'Ravari Store',
  database: dbReady ? 'connected' : 'fallback',
  dbHost: dbHostUsed,
  dbError: dbError,
  dbDiag: dbDiag,
  time: new Date().toISOString()
}));

fastify.get('/api/products', async () => {
  if (dbReady && Product) {
    try {
      const rows = await Product.findAll({ order: [['id', 'ASC']] });
      if (rows && rows.length) return rows;
    } catch (err) {
      console.error('[RAVARI] products query failed:', err.message);
    }
  }
  return PRODUCTS;
});

fastify.get('/api/products/:id', async (request, reply) => {
  const id = parseInt(request.params.id, 10);
  if (dbReady && Product) {
    try {
      const row = await Product.findByPk(id);
      if (row) return row;
    } catch (err) {
      console.error('[RAVARI] product query failed:', err.message);
    }
  }
  const product = PRODUCTS.find(p => p.id === id);
  if (!product) { reply.code(404); return { error: 'Product not found' }; }
  return product;
});

// SPA fallback -> index.html
fastify.setNotFoundHandler((request, reply) => {
  const indexPath = path.join(buildPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    reply.type('text/html').send(fs.readFileSync(indexPath));
  } else {
    reply.code(404).send({ error: 'Not found' });
  }
});

// ---------------------------------------------------------------------------
// Start — listen FIRST so the site is always reachable, then init DB
// ---------------------------------------------------------------------------
fastify.listen({ port: PORT, host: HOST })
  .then(() => {
    console.log(`[RAVARI] ✅ Listening on ${HOST}:${PORT}`);
    initDatabase(); // background, non-blocking
  })
  .catch((err) => {
    fastify.log.error(err);
    process.exit(1);
  });

process.on('SIGTERM', () => fastify.close().then(() => process.exit(0)));
process.on('SIGINT', () => fastify.close().then(() => process.exit(0)));
