const puppeteer = require('puppeteer');
const axios = require('axios');
const fs = require('fs').promises;
const path = require('path');
const Product = require('../models/Product');

// Generate slug
const generateSlug = (name) => {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');
};

// Download image
const downloadImage = async (imageUrl, filename) => {
  try {
    const imagesDir = path.join(__dirname, '../public/images');

    // Ensure directory exists
    await fs.mkdir(imagesDir, { recursive: true });

    const response = await axios({
      method: 'GET',
      url: imageUrl,
      responseType: 'stream',
      timeout: 10000
    });

    const filepath = path.join(imagesDir, filename);
    const writer = require('fs').createWriteStream(filepath);

    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => resolve(`/images/${filename}`));
      writer.on('error', reject);
    });
  } catch (error) {
    console.error(`Error downloading image ${imageUrl}:`, error.message);
    return null;
  }
};

// Scrape ravari.in
exports.scrapeRavari = async () => {
  let browser;
  try {
    console.log('🕷️ Starting scraper for ravari.in...');
    browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();

    await page.setViewport({ width: 1280, height: 1024 });

    // Navigate to shop page
    console.log('📄 Loading ravari.in/shop...');
    await page.goto('https://www.ravari.in/shop', { waitUntil: 'networkidle2', timeout: 30000 });

    // Get all product links
    const productLinks = await page.evaluate(() => {
      const links = [];
      document.querySelectorAll('a[href*="/product/"], a[data-product]').forEach(el => {
        const href = el.getAttribute('href');
        if (href && href.includes('/product')) {
          links.push(href);
        }
      });
      return [...new Set(links)]; // Remove duplicates
    });

    console.log(`Found ${productLinks.length} products. Scraping details...`);

    const products = [];

    // Scrape each product
    for (let i = 0; i < Math.min(productLinks.length, 50); i++) {
      try {
        const link = productLinks[i];
        console.log(`[${i + 1}/${Math.min(productLinks.length, 50)}] Scraping: ${link}`);

        await page.goto(`https://www.ravari.in${link}`, { waitUntil: 'networkidle2', timeout: 20000 });

        const product = await page.evaluate(() => {
          const data = {
            name: '',
            description: '',
            price: 0,
            salePrice: null,
            category: 'Leather Goods',
            images: [],
            material: [],
            color: [],
            size: []
          };

          // Extract product name
          const nameEl = document.querySelector('h1, .product-title, [data-product-name]');
          if (nameEl) data.name = nameEl.textContent.trim();

          // Extract price
          const priceEl = document.querySelector('.price, .product-price, [data-price]');
          if (priceEl) {
            const priceText = priceEl.textContent.match(/[\d,]+/);
            if (priceText) data.price = parseInt(priceText[0].replace(/,/g, ''));
          }

          // Extract description
          const descEl = document.querySelector('.description, .product-description, [data-description]');
          if (descEl) data.description = descEl.textContent.trim().substring(0, 500);

          // Extract images
          document.querySelectorAll('img[src*="product"], img[alt*="product"]').forEach(img => {
            const src = img.getAttribute('src') || img.getAttribute('data-src');
            if (src && !src.includes('logo') && !src.includes('icon')) {
              data.images.push({ url: src, alt: img.getAttribute('alt') || data.name });
            }
          });

          // Extract material info
          const materialText = document.body.textContent.toLowerCase();
          if (materialText.includes('leather')) data.material.push('Genuine Leather');
          if (materialText.includes('canvas')) data.material.push('Canvas');
          if (materialText.includes('suede')) data.material.push('Suede');

          return data;
        });

        // Download and save images
        if (product.images.length > 0) {
          const downloadedImages = [];
          for (const img of product.images.slice(0, 3)) {
            if (img.url) {
              const filename = `product-${Date.now()}-${Math.random().toString(36).substr(2, 9)}.jpg`;
              const savedUrl = await downloadImage(img.url, filename);
              if (savedUrl) {
                downloadedImages.push({ url: savedUrl, alt: img.alt || product.name });
              }
            }
          }
          product.images = downloadedImages;
          product.thumbnail = downloadedImages[0]?.url || null;
        }

        if (product.name) {
          product.slug = generateSlug(product.name);
          product.stock = Math.floor(Math.random() * 50) + 10;
          product.isFeatured = Math.random() > 0.8;
          product.isNew = Math.random() > 0.9;
          products.push(product);
        }

        // Add delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Error scraping product: ${error.message}`);
      }
    }

    await browser.close();

    console.log(`✅ Scraped ${products.length} products. Saving to database...`);

    // Save to database
    let savedCount = 0;
    for (const product of products) {
      try {
        const existingProduct = await Product.findOne({ slug: product.slug });
        if (!existingProduct) {
          const newProduct = new Product(product);
          await newProduct.save();
          savedCount++;
        }
      } catch (error) {
        console.error(`Error saving product: ${error.message}`);
      }
    }

    console.log(`✨ Successfully saved ${savedCount} new products to database!`);
    return { success: true, savedCount, totalScraped: products.length };
  } catch (error) {
    console.error('🚨 Scraper error:', error);
    throw error;
  } finally {
    if (browser) await browser.close();
  }
};

// Run scraper
if (require.main === module) {
  exports.scrapeRavari()
    .then(result => {
      console.log('Scraper completed:', result);
      process.exit(0);
    })
    .catch(error => {
      console.error('Scraper failed:', error);
      process.exit(1);
    });
}
