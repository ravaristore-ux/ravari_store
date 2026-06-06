const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// Get robots.txt
router.get('/robots.txt', async (req, res) => {
  const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /cart/
Disallow: /checkout/
Disallow: /account/
Disallow: /search/
Disallow: /filter/

Allow: /?sort=
Allow: /?page=

Crawl-delay: 1
Sitemap: https://ravari.in/sitemap.xml
Sitemap: https://ravari.in/sitemap-products.xml
Sitemap: https://ravari.in/sitemap-blog.xml`;

  res.setHeader('Content-Type', 'text/plain');
  res.send(robotsTxt);
});

// Get sitemap.xml (main sitemap)
router.get('/sitemap.xml', async (req, res) => {
  try {
    const siteUrl = 'https://ravari.in';
    const now = new Date().toISOString().split('T')[0];

    const mainPages = [
      { url: '/', changefreq: 'weekly', priority: '1.0', lastmod: now },
      { url: '/products', changefreq: 'weekly', priority: '0.9', lastmod: now },
      { url: '/products?category=handbags', changefreq: 'weekly', priority: '0.9', lastmod: now },
      { url: '/products?category=accessories', changefreq: 'weekly', priority: '0.9', lastmod: now },
      { url: '/products?category=organizers', changefreq: 'weekly', priority: '0.9', lastmod: now },
      { url: '/about', changefreq: 'monthly', priority: '0.8', lastmod: now },
      { url: '/contact', changefreq: 'monthly', priority: '0.7', lastmod: now }
    ];

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    mainPages.forEach(page => {
      sitemap += `
  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>${page.changefreq}</changefreq>
    <priority>${page.priority}</priority>
  </url>`;
    });

    sitemap += `
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Sitemap error:', error);
    res.status(500).json({ error: 'Error generating sitemap' });
  }
});

// Get sitemap-products.xml
router.get('/sitemap-products.xml', async (req, res) => {
  try {
    const siteUrl = 'https://ravari.in';
    const now = new Date().toISOString().split('T')[0];
    const products = await Product.find({ active: true }).select('slug images name').limit(50000);

    let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
`;

    products.forEach(product => {
      sitemap += `
  <url>
    <loc>${siteUrl}/products/${product.slug}</loc>
    <lastmod>${now}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>`;

      if (product.images && product.images.length > 0) {
        product.images.slice(0, 10).forEach(image => {
          sitemap += `
    <image:image>
      <image:loc>${image}</image:loc>
      <image:title>${product.name}</image:title>
    </image:image>`;
        });
      }

      sitemap += `
  </url>`;
    });

    sitemap += `
</urlset>`;

    res.setHeader('Content-Type', 'application/xml');
    res.send(sitemap);
  } catch (error) {
    console.error('Product sitemap error:', error);
    res.status(500).json({ error: 'Error generating product sitemap' });
  }
});

// Get sitemap-blog.xml
router.get('/sitemap-blog.xml', async (req, res) => {
  const siteUrl = 'https://ravari.in';
  const now = new Date().toISOString().split('T')[0];

  const blogPages = [
    { url: '/blog/how-to-care-leather-handbags', lastmod: now },
    { url: '/blog/leather-quality-guide', lastmod: now },
    { url: '/blog/sustainable-leather-goods', lastmod: now },
    { url: '/blog/leather-bag-styles', lastmod: now }
  ];

  let sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
`;

  blogPages.forEach(page => {
    sitemap += `
  <url>
    <loc>${siteUrl}${page.url}</loc>
    <lastmod>${page.lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>`;
  });

  sitemap += `
</urlset>`;

  res.setHeader('Content-Type', 'application/xml');
  res.send(sitemap);
});

module.exports = router;
