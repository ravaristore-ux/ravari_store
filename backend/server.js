#!/usr/bin/env node

require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');

console.log('[STARTING SERVER]');
console.log(`Time: ${new Date().toISOString()}`);
console.log(`Environment: ${process.env.NODE_ENV || 'production'}`);
console.log(`Port: ${process.env.PORT || 8080}`);

const app = express();

// Middleware
app.use(cors({ origin: '*', credentials: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

console.log('[MIDDLEWARE SETUP COMPLETE]');

// Serve static frontend
const frontendBuild = path.join(__dirname, '../frontend/build');
if (fs.existsSync(frontendBuild)) {
  app.use(express.static(frontendBuild));
  console.log('[FRONTEND BUILD FOUND]');
} else {
  console.log('[WARNING: FRONTEND BUILD NOT FOUND]');
}

console.log('[STATIC FILES SETUP COMPLETE]');

// Health check - CRITICAL ENDPOINT
app.get('/api/health', (req, res) => {
  console.log('[HEALTH CHECK REQUESTED]');
  res.json({
    status: 'ok',
    message: 'Server is alive and responding',
    timestamp: new Date().toISOString()
  });
});

// Home endpoint
app.get('/', (req, res) => {
  console.log('[HOME REQUESTED]');
  res.send('<h1>Ravari Store is Running</h1><p><a href="/api/health">/api/health</a></p>');
});

// Error handler
app.use((err, req, res, next) => {
  console.error('[ERROR]', err.message);
  res.status(500).json({ error: 'Server error', message: err.message });
});

// 404 handler
app.use((req, res) => {
  console.log(`[404] ${req.method} ${req.path}`);
  res.status(404).json({ error: 'Not found' });
});

// Start server
const PORT = process.env.PORT || 8080;
console.log(`[ABOUT TO LISTEN ON PORT ${PORT}]`);

try {
  const server = app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SUCCESS] Server listening on port ${PORT}`);
    console.log(`[URL] http://localhost:${PORT}/`);
    console.log(`[HEALTH] http://localhost:${PORT}/api/health`);
  });

  // Handle shutdown
  process.on('SIGTERM', () => {
    console.log('[SIGTERM] Shutting down...');
    server.close(() => {
      console.log('[SHUTDOWN] Server closed');
      process.exit(0);
    });
  });
} catch (err) {
  console.error('[CRITICAL ERROR STARTING SERVER]', err.message);
  console.error(err.stack);
  process.exit(1);
}
