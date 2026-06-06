const mongoose = require('mongoose');
const Product = require('../models/Product');

const categoryMapping = {
  // HANDBAGS
  'RAVARI Premium Brown Leather Sling Bag': 'Handbags',
  'RAVARI Vintage Brown Leather Sling Bag': 'Handbags',
  'Ravari Leather Women Handbag': 'Handbags',
  'RAVARI Premium Textured Leather Handbag': 'Handbags',
  'RAVARI Boho-Chic Leather-Trim Tote Bag for Women': 'Handbags',

  // LEATHER ACCESSORIES
  'RAVARI Premium Leather Key Holder': 'Leather Accessories',
  'Ravari Ember Travel Folio Leather Wallet': 'Leather Accessories',
  'RAVARI Artisan Leather Work Apron': 'Leather Accessories',

  // LEATHER ORGANIZERS
  'RAVARI Premium Leather Desk Organizer': 'Leather Organizers',
  'RAVARI Leather Jewellery Box Organizer for Women': 'Leather Organizers',
  "RAVARI Men's & Women's 20-Slot Watch Box": 'Leather Organizers'
};

async function updateCategories() {
  try {
    await mongoose.connect('mongodb://localhost:27017/ravari');
    console.log('Connected to MongoDB');

    console.log('\n📊 UPDATING PRODUCT CATEGORIES...\n');

    for (const [productName, newCategory] of Object.entries(categoryMapping)) {
      const result = await Product.findOneAndUpdate(
        { name: productName },
        { category: newCategory },
        { new: true }
      );

      if (result) {
        console.log(`✅ ${productName}`);
        console.log(`   → ${newCategory}\n`);
      } else {
        console.log(`❌ Product not found: ${productName}\n`);
      }
    }

    console.log('\n=== CATEGORY SUMMARY ===\n');

    const handbags = await Product.countDocuments({ category: 'Handbags' });
    const accessories = await Product.countDocuments({ category: 'Leather Accessories' });
    const organizers = await Product.countDocuments({ category: 'Leather Organizers' });

    console.log(`👜 Handbags: ${handbags} products`);
    console.log(`🔑 Leather Accessories: ${accessories} products`);
    console.log(`📦 Leather Organizers: ${organizers} products`);
    console.log(`\n✅ Total: ${handbags + accessories + organizers} products`);

    await mongoose.disconnect();
    console.log('\n✅ Database update complete!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

updateCategories();
