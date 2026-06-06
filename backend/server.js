#!/usr/bin/env node
const Fastify = require('fastify');
const path = require('path');
const fs = require('fs');

const fastify = Fastify({ logger: true, bodyLimit: 2097152 });

const PORT = process.env.PORT || 3000;
const HOST = '0.0.0.0';

console.log(`[RAVARI] Starting server on ${HOST}:${PORT}`);

// ---------------------------------------------------------------------------
// Product catalogue (rich shape used by the full React frontend)
// ---------------------------------------------------------------------------
function img(url, alt) { return { url, alt }; }

const PRODUCTS = [
  {
    id: 1, _id: '1',
    name: 'RAVARI Vintage Brown Leather Sling Bag for Men & Women',
    slug: 'ravari-vintage-brown-leather-sling-bag',
    price: 4599, salePrice: 2599, category: 'Sling Bags',
    thumbnail: '/images/p1-a.png',
    images: [img('/images/p1-a.png', 'Vintage Brown Leather Sling Bag'), img('/images/p1-b.png', 'Vintage Sling Bag side'), img('/images/p1-c.png', 'Vintage Sling Bag detail')],
    description: 'Compact vintage brown leather crossbody chest bag with multiple zippered compartments. Handcrafted for everyday versatility and timeless style.',
    stock: 18, isNew: true, isFeatured: true, rating: 5, reviewCount: 12
  },
  {
    id: 2, _id: '2',
    name: 'RAVARI Premium Brown Leather Sling Bag for Men & Women',
    slug: 'ravari-premium-brown-leather-sling-bag',
    price: 4599, salePrice: 2599, category: 'Sling Bags',
    thumbnail: '/images/p2-a.png',
    images: [img('/images/p2-a.png', 'Premium Brown Leather Sling Bag'), img('/images/p2-b.png', 'Premium Sling Bag side'), img('/images/p2-c.png', 'Premium Sling Bag detail')],
    description: 'Premium full-grain brown leather sling bag with a stylish silhouette and durable hardware. The perfect blend of fashion and function.',
    stock: 15, isNew: true, isFeatured: true, rating: 5, reviewCount: 9
  },
  {
    id: 3, _id: '3',
    name: 'RAVARI Boho-Chic Leather-Trim Tote Bag for Women',
    slug: 'ravari-boho-chic-leather-trim-tote-bag',
    price: 4499, salePrice: 2499, category: 'Tote Bags',
    thumbnail: '/images/p3-a.png',
    images: [img('/images/p3-a.png', 'Boho-Chic Tote Bag'), img('/images/p3-b.png', 'Boho-Chic Tote interior'), img('/images/p3-c.png', 'Boho-Chic Tote detail')],
    description: 'Spacious boho-chic tote with premium leather trim and a soft woven body. Roomy enough for work, travel, and weekends.',
    stock: 12, isNew: false, isFeatured: true, rating: 4, reviewCount: 7
  },
  {
    id: 4, _id: '4',
    name: 'RAVARI Premium Textured Leather Handbag',
    slug: 'ravari-premium-textured-leather-handbag',
    price: 4999, salePrice: null, category: 'Handbags',
    thumbnail: '/images/p4-a.png',
    images: [img('/images/p4-a.png', 'Premium Textured Leather Handbag'), img('/images/p4-b.png', 'Textured Handbag detail')],
    description: 'Statement textured-leather handbag with structured form and refined detailing. A luxurious everyday companion.',
    stock: 8, isNew: true, isFeatured: true, rating: 5, reviewCount: 5
  },
  {
    id: 5, _id: '5',
    name: 'RAVARI Artisan Leather Work Apron for Men & Women',
    slug: 'ravari-artisan-leather-work-apron',
    price: 2999, salePrice: 1599, category: 'Aprons',
    thumbnail: '/images/p5-a.png',
    images: [img('/images/p5-a.png', 'Artisan Leather Work Apron'), img('/images/p5-b.png', 'Work Apron pockets'), img('/images/p5-c.png', 'Work Apron detail')],
    description: 'Durable artisan leather work apron with adjustable straps and practical pockets. Built for craftsmen, baristas, and creators.',
    stock: 25, isNew: false, isFeatured: true, rating: 5, reviewCount: 14
  },
  {
    id: 6, _id: '6',
    name: 'RAVARI Premium Leather Jewellery Box',
    slug: 'ravari-premium-leather-jewellery-box',
    price: 4999, salePrice: null, category: 'Organizers',
    thumbnail: '/images/p6-a.jpg',
    images: [img('/images/p6-a.jpg', 'Premium Leather Jewellery Box')],
    description: 'Handcrafted leather jewellery box with soft-lined compartments to keep your treasures organized and elegant.',
    stock: 10, isNew: false, isFeatured: true, rating: 4, reviewCount: 3
  }
];

// In-memory reviews (per productId). Persisted across requests, reset on restart.
const REVIEWS = {};

// ---------------------------------------------------------------------------
// Database (best-effort via pure-JS `mysql` driver; mysql2 fails on Hostinger)
// ---------------------------------------------------------------------------
let dbReady = false;
let dbError = null;
let dbHostUsed = null;
let pool = null;
const sleep = (ms) => new Promise(r => setTimeout(r, ms));

function makePool(host) {
  const mysql = require('mysql');
  return mysql.createPool({
    connectionLimit: 5, host, port: process.env.DB_PORT || 3306,
    user: process.env.DB_USER || 'u800235524_ravari_user',
    password: process.env.DB_PASSWORD || 'Ravari@2026Secure123!',
    database: process.env.DB_NAME || 'u800235524_ravari_store',
    connectTimeout: 8000
  });
}
function query(sql, params) {
  return new Promise((resolve, reject) => {
    pool.query(sql, params || [], (err, results) => { if (err) reject(err); else resolve(results); });
  });
}

const CREATE_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255),
    description TEXT,
    price DECIMAL(10,2) NOT NULL,
    salePrice DECIMAL(10,2) NULL,
    stock INT DEFAULT 0,
    category VARCHAR(100),
    thumbnail VARCHAR(255),
    images TEXT,
    isNew TINYINT(1) DEFAULT 0,
    isFeatured TINYINT(1) DEFAULT 0,
    rating DECIMAL(3,1) DEFAULT 0,
    reviewCount INT DEFAULT 0,
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;`;

async function seedRows() {
  for (const p of PRODUCTS) {
    await query(
      'INSERT INTO products (id, name, slug, description, price, salePrice, stock, category, thumbnail, images, isNew, isFeatured, rating, reviewCount) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
      [p.id, p.name, p.slug, p.description, p.price, p.salePrice, p.stock, p.category, p.thumbnail, JSON.stringify(p.images || []), p.isNew ? 1 : 0, p.isFeatured ? 1 : 0, p.rating || 0, p.reviewCount || 0]
    );
  }
  console.log(`[RAVARI] ✅ Seeded ${PRODUCTS.length} products into MySQL`);
}

async function setupSchemaAndSeed() {
  await query(CREATE_TABLE_SQL);
  const cols = await query("SHOW COLUMNS FROM products LIKE 'rating'");
  if (!cols || cols.length === 0) {
    console.log('[RAVARI] Schema outdated, rebuilding products table...');
    await query('DROP TABLE IF EXISTS products');
    await query(CREATE_TABLE_SQL);
    await seedRows();
    return;
  }
  const rows = await query('SELECT COUNT(*) AS c FROM products');
  if (rows[0].c === 0) await seedRows();
  else console.log(`[RAVARI] ✅ ${rows[0].c} products already in MySQL`);
}

function shapeRow(r) {
  let images = [];
  try { images = r.images ? JSON.parse(r.images) : []; } catch (_) { images = []; }
  if (!Array.isArray(images) || images.length === 0) images = [{ url: r.thumbnail, alt: r.name }];
  return {
    id: r.id, _id: String(r.id), name: r.name, slug: r.slug, description: r.description,
    price: Number(r.price), salePrice: r.salePrice != null ? Number(r.salePrice) : null,
    stock: r.stock, category: r.category, thumbnail: r.thumbnail, images,
    isNew: !!r.isNew, isFeatured: !!r.isFeatured,
    rating: r.rating != null ? Number(r.rating) : 0, reviewCount: r.reviewCount || 0
  };
}

async function getAllProducts() {
  if (dbReady && pool) {
    try {
      const rows = await query('SELECT * FROM products ORDER BY id ASC');
      if (rows && rows.length) return rows.map(shapeRow);
    } catch (err) { console.error('[RAVARI] products query failed:', err.message); }
  }
  return PRODUCTS;
}

async function initDatabase() {
  const hosts = [process.env.DB_HOST, 'localhost', '127.0.0.1'].filter(Boolean);
  const errors = [];
  for (let attempt = 1; attempt <= 3; attempt++) {
    for (const host of hosts) {
      try {
        pool = makePool(host);
        await query('SELECT 1');
        await setupSchemaAndSeed();
        dbReady = true; dbError = null; dbHostUsed = host;
        console.log(`[RAVARI] ✅ Database connected via ${host}`);
        return;
      } catch (err) {
        errors.push(`${host}:${err.code || ''} ${err.message}`);
        try { if (pool) pool.end(() => {}); } catch (_) {}
        pool = null;
      }
    }
    dbError = errors.slice(-3).join(' | ');
    await sleep(2000);
  }
  console.error('[RAVARI] ⚠️  DB unavailable, using in-code catalog');
}

// ---------------------------------------------------------------------------
// Static assets: React build, product images, and product videos
// ---------------------------------------------------------------------------
const buildPath = path.join(__dirname, '../frontend/build');
if (fs.existsSync(path.join(buildPath, 'index.html'))) {
  fastify.register(require('@fastify/static'), { root: buildPath, prefix: '/' });
  console.log(`[RAVARI] Serving React frontend from ${buildPath}`);
} else {
  console.log(`[RAVARI] ⚠️  React build not found at ${buildPath}`);
}

// Videos (and any extra images) served from backend/public
const backendPublic = path.join(__dirname, 'public');
if (fs.existsSync(backendPublic)) {
  fastify.register(require('@fastify/static'), { root: backendPublic, prefix: '/assets/', decorateReply: false });
  // Direct /videos and /images passthrough to backend/public
  fastify.register(require('@fastify/static'), { root: path.join(backendPublic, 'videos'), prefix: '/videos/', decorateReply: false });
  console.log(`[RAVARI] Serving videos from ${path.join(backendPublic, 'videos')}`);
}

// ---------------------------------------------------------------------------
// API routes
// ---------------------------------------------------------------------------
fastify.get('/api/health', async () => ({
  status: 'ok', app: 'Ravari Store',
  database: dbReady ? 'connected' : 'fallback', dbHost: dbHostUsed, dbError,
  products: (await getAllProducts()).length, time: new Date().toISOString()
}));

// List with filters + pagination -> { products, pagination }
fastify.get('/api/products', async (request) => {
  let all = await getAllProducts();
  const q = request.query || {};
  if (q.search) {
    const s = String(q.search).toLowerCase();
    all = all.filter(p => p.name.toLowerCase().includes(s) || (p.description || '').toLowerCase().includes(s));
  }
  if (q.category) all = all.filter(p => p.category === q.category);
  if (q.minPrice) all = all.filter(p => (p.salePrice || p.price) >= Number(q.minPrice));
  if (q.maxPrice) all = all.filter(p => (p.salePrice || p.price) <= Number(q.maxPrice));
  if (q.sort === 'price-low') all.sort((a, b) => (a.salePrice || a.price) - (b.salePrice || b.price));
  else if (q.sort === 'price-high') all.sort((a, b) => (b.salePrice || b.price) - (a.salePrice || a.price));
  else if (q.sort === 'newest') all.sort((a, b) => (b.isNew ? 1 : 0) - (a.isNew ? 1 : 0));

  const total = all.length;
  const limit = q.limit ? parseInt(q.limit, 10) : 12;
  const page = q.page ? parseInt(q.page, 10) : 1;
  const pages = Math.max(1, Math.ceil(total / limit));
  const start = (page - 1) * limit;
  const items = all.slice(start, start + limit);
  return { products: items, pagination: { page, pages, total, limit } };
});

fastify.get('/api/products/featured', async () => {
  const all = await getAllProducts();
  const f = all.filter(p => p.isFeatured);
  return { products: f.length ? f : all };
});

fastify.get('/api/products/new', async () => {
  const all = await getAllProducts();
  const n = all.filter(p => p.isNew);
  return { products: n.length ? n : all.slice(0, 4) };
});

fastify.get('/api/products/categories/list', async () => {
  const all = await getAllProducts();
  const categories = [...new Set(all.map(p => p.category).filter(Boolean))];
  return { categories };
});

fastify.get('/api/products/slug/:slug', async (request, reply) => {
  const all = await getAllProducts();
  const product = all.find(p => p.slug === request.params.slug);
  if (!product) { reply.code(404); return { error: 'Product not found' }; }
  return { product, reviews: REVIEWS[product.id] || [] };
});

fastify.get('/api/products/:id', async (request, reply) => {
  const id = parseInt(request.params.id, 10);
  const all = await getAllProducts();
  const product = all.find(p => p.id === id);
  if (!product) { reply.code(404); return { error: 'Product not found' }; }
  return { product };
});

// Reviews
fastify.get('/api/reviews', async () => ({ reviews: [] }));
fastify.post('/api/reviews', async (request) => {
  const { productId, rating, comment, name } = request.body || {};
  const pid = parseInt(productId, 10);
  if (!REVIEWS[pid]) REVIEWS[pid] = [];
  const review = { id: REVIEWS[pid].length + 1, name: name || 'Customer', rating: rating || 5, comment: comment || '', createdAt: new Date().toISOString() };
  REVIEWS[pid].push(review);
  return { success: true, review };
});

// --- Admin (light auth: requires Authorization header) ---
function isAuthed(request) {
  const h = request.headers && request.headers.authorization;
  return !!h; // client logs in then sends a bearer token
}

fastify.post('/api/auth/login', async (request, reply) => {
  const { email, password } = request.body || {};
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@ravari.in';
  const adminPass = process.env.ADMIN_PASSWORD || 'ravari@2027';
  if (email === adminEmail && password === adminPass) {
    return { success: true, token: 'admin-token-12345', user: { email, role: 'admin' } };
  }
  reply.code(401); return { success: false, error: 'Invalid credentials' };
});

fastify.post('/api/admin/products', async (request, reply) => {
  if (!isAuthed(request)) { reply.code(401); return { error: 'Unauthorized' }; }
  const b = request.body || {};
  const all = await getAllProducts();
  const newId = Math.max(0, ...all.map(p => p.id)) + 1;
  const images = b.images || (b.thumbnail ? [{ url: b.thumbnail, alt: b.name }] : []);
  if (dbReady && pool) {
    try {
      await query('INSERT INTO products (id, name, slug, description, price, salePrice, stock, category, thumbnail, images, isNew, isFeatured, rating, reviewCount) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?)',
        [newId, b.name, b.slug || String(b.name||'').toLowerCase().replace(/[^a-z0-9]+/g,'-'), b.description, b.price, b.salePrice || null, b.stock || 0, b.category, b.thumbnail, JSON.stringify(images), b.isNew ? 1 : 0, b.isFeatured ? 1 : 0, 0, 0]);
    } catch (e) { reply.code(500); return { error: e.message }; }
  }
  return { success: true, product: { id: newId, _id: String(newId), ...b, images } };
});

fastify.put('/api/admin/products/:id', async (request, reply) => {
  if (!isAuthed(request)) { reply.code(401); return { error: 'Unauthorized' }; }
  const id = parseInt(request.params.id, 10);
  const b = request.body || {};
  if (dbReady && pool) {
    try {
      await query('UPDATE products SET name=?, description=?, price=?, salePrice=?, stock=?, category=?, thumbnail=?, isNew=?, isFeatured=?, updatedAt=NOW() WHERE id=?',
        [b.name, b.description, b.price, b.salePrice || null, b.stock || 0, b.category, b.thumbnail, b.isNew ? 1 : 0, b.isFeatured ? 1 : 0, id]);
    } catch (e) { reply.code(500); return { error: e.message }; }
  }
  return { success: true };
});

fastify.delete('/api/admin/products/:id', async (request, reply) => {
  if (!isAuthed(request)) { reply.code(401); return { error: 'Unauthorized' }; }
  const id = parseInt(request.params.id, 10);
  if (dbReady && pool) {
    try { await query('DELETE FROM products WHERE id=?', [id]); }
    catch (e) { reply.code(500); return { error: e.message }; }
  }
  return { success: true };
});

// SPA fallback
fastify.setNotFoundHandler((request, reply) => {
  const indexPath = path.join(buildPath, 'index.html');
  if (fs.existsSync(indexPath)) reply.type('text/html').send(fs.readFileSync(indexPath));
  else reply.code(404).send({ error: 'Not found' });
});

// Start: listen first, then DB
fastify.listen({ port: PORT, host: HOST })
  .then(() => { console.log(`[RAVARI] ✅ Listening on ${HOST}:${PORT}`); initDatabase(); })
  .catch((err) => { fastify.log.error(err); process.exit(1); });

process.on('SIGTERM', () => fastify.close().then(() => process.exit(0)));
process.on('SIGINT', () => fastify.close().then(() => process.exit(0)));
