const express = require('express');
const router = express.Router();
const { adminAuth } = require('../middleware/auth');
const { scrapeRavari } = require('../scrapers/ravaryScraper');

// Start scraper (admin only)
router.post('/start', adminAuth, async (req, res) => {
  try {
    res.json({
      success: true,
      message: 'Scraper started in background. Check back in a few minutes.',
      status: 'running'
    });

    // Run scraper in background
    scrapeRavari().then(result => {
      console.log('✅ Scraper completed:', result);
    }).catch(error => {
      console.error('❌ Scraper error:', error);
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
