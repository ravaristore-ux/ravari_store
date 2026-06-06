const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

dotenv.config();

const realProducts = [
  {
    name: 'RAVARI Premium Textured Leather Handbag',
    slug: 'ravari-premium-textured-leather-handbag',
    description: 'Luxurious premium textured leather handbag with elegant design and multiple compartments. Perfect for everyday use or special occasions. Hand-selected genuine leather with superior craftsmanship.',
    category: 'Handbags',
    price: 4999,
    salePrice: 3999,
    material: ['Premium Genuine Leather', 'Textured Finish', 'Gold-Toned Hardware'],
    color: ['Brown', 'Black', 'Tan'],
    size: ['Large'],
    stock: 15,
    images: [
      { url: '/images/RAVARI Premium Textured Leather Handbag 1.png', alt: 'Front View' },
      { url: '/images/RAVARI Premium Textured Leather Handbag 4.jpg', alt: 'Side View' },
      { url: '/images/RAVARI Premium Textured Leather Handbag 5.jpg', alt: 'Detail' },
      { url: '/images/RAVARI Premium Textured Leather Handbag 6.png', alt: 'Full View' }
    ],
    thumbnail: '/images/RAVARI Premium Textured Leather Handbag 1.png',
    isFeatured: true,
    isNew: true,
    careInstructions: 'Wipe with soft cloth. Avoid direct sunlight. Store in dust bag. Condition leather quarterly.',
    artisanStory: 'Handcrafted by master artisans with decades of experience in luxury leather goods manufacturing. Each piece is unique and made with passion for perfection.'
  },
  {
    name: 'RAVARI Vintage Brown Leather Sling Bag',
    slug: 'ravari-vintage-brown-leather-sling-bag',
    description: 'Compact crossbody sling bag with multiple zippered compartments. Perfect for travel and daily use. Vintage aesthetic with modern functionality. Timeless design that complements any style.',
    category: 'Sling Bags',
    price: 2999,
    salePrice: 2299,
    material: ['Vintage Leather', 'Premium Quality', 'YKK Zippers'],
    color: ['Brown', 'Black', 'Cognac'],
    size: ['Medium'],
    stock: 25,
    images: [
      { url: '/images/RAVARI Vintage Brown Leather Sling Bag for Men & Women Compact Crossbody Chest Bag with Multi Zipp.png', alt: 'Front View' },
      { url: '/images/RAVARI Vintage Brown Leather Sling Bag for Men & Women Compact Crossbody Chest Bag with Multi (30).png', alt: 'Side View' },
      { url: '/images/RAVARI Vintage Brown Leather Sling Bag for Men & Women Compact Crossbody Chest Bag with Multi (31).png', alt: 'Back View' },
      { url: '/images/RAVARI Vintage Brown Leather Sling Bag for Men & Women Compact Crossbody Chest Bag with Multi (32).png', alt: 'Detail View' },
      { url: '/images/RAVARI Vintage Brown Leather Sling Bag for Men & Women Compact Crossbody Chest Bag with Multi Z(1).png', alt: 'Strap Detail' }
    ],
    thumbnail: '/images/RAVARI Vintage Brown Leather Sling Bag for Men & Women Compact Crossbody Chest Bag with Multi Zipp.png',
    isFeatured: true,
    isNew: false,
    careInstructions: 'Clean with leather conditioner monthly. Keep away from moisture and extreme heat. Use dust bag when storing.',
    artisanStory: 'Each piece reflects traditional craftsmanship passed down through generations. Our artisans use time-tested techniques to create bags that age beautifully.'
  },
  {
    name: 'RAVARI Boho-Chic Leather-Trim Tote Bag',
    slug: 'ravari-boho-chic-leather-trim-tote-bag',
    description: 'Spacious bohemian-style tote bag with genuine leather trim. Versatile for shopping, work, or travel. Sustainably crafted with eco-conscious materials. Statement piece for the modern woman.',
    category: 'Tote Bags',
    price: 3499,
    salePrice: 2799,
    material: ['Organic Canvas', 'Genuine Leather Trim', 'Natural Fibers'],
    color: ['Natural', 'Brown', 'Olive Green'],
    size: ['Large', 'Extra Large'],
    stock: 20,
    images: [
      { url: '/images/RAVARI Boho-Chic Leather-Trim Tote Bag for Women1.png', alt: 'Front View' },
      { url: '/images/RAVARI Boho-Chic Leather-Trim Tote Bag for Women2.png', alt: 'Side View' },
      { url: '/images/RAVARI Boho-Chic Leather-Trim Tote Bag for Women4.png', alt: 'Detail View' },
      { url: '/images/RAVARI Boho-Chic Leather-Trim Tote Bag for Women5.png', alt: 'Bottom View' },
      { url: '/images/RAVARI_Boho-Chic_Leather-Trim_Tote_Bag_for_Women3new.png', alt: 'Inside View' },
      { url: '/images/RAVARI_Boho-Chic_Leather-Trim_Tote_Bag_for_Women6.png', alt: 'Worn Style' }
    ],
    thumbnail: '/images/RAVARI Boho-Chic Leather-Trim Tote Bag for Women1.png',
    isFeatured: false,
    isNew: true,
    careInstructions: 'Machine wash cold. Air dry. Condition leather trim as needed. Keep out of direct sunlight.',
    artisanStory: 'Eco-friendly and ethically produced with commitment to sustainability. We partner with artisans who share our values of quality and environmental responsibility.'
  },
  {
    name: 'RAVARI Premium Brown Leather Sling Bag',
    slug: 'ravari-premium-brown-leather-sling-bag',
    description: 'Elegant premium leather sling bag with multiple compartments and practical design. Durable and stylish for both men and women. Perfect travel companion for the discerning traveler. Combines functionality with luxury.',
    category: 'Sling Bags',
    price: 3299,
    salePrice: 2599,
    material: ['Premium Genuine Leather', 'Brass Hardware', 'Leather Lining'],
    color: ['Brown', 'Black'],
    size: ['Medium'],
    stock: 18,
    images: [
      { url: '/images/RAVARI Premium Brown Leather Sling Bag(2).png', alt: 'Front View' },
      { url: '/images/RAVARI Premium Brown Leather Sling Bag(17).png', alt: 'Back View' },
      { url: '/images/RAVARI Premium Brown Leather Sling Bag(19).png', alt: 'Side View' },
      { url: '/images/RAVARI Premium Brown Leather Sling Bag(26).png', alt: 'Detail View' },
      { url: '/images/RAVARI Premium Brown Leather Sling Bag(27).png', alt: 'Worn Style' },
      { url: '/images/RAVARI Premium Brown Leather Sling Bag(28).png', alt: 'Open View' },
      { url: '/images/RAVARI Premium Brown Leather Sling Bag(29).png', alt: 'Straps Detail' }
    ],
    thumbnail: '/images/RAVARI Premium Brown Leather Sling Bag(2).png',
    isFeatured: true,
    isNew: false,
    careInstructions: 'Apply leather conditioner regularly. Store in cool, dry place. Keep away from water and excessive heat.',
    artisanStory: 'Premium leather sourced from finest tanneries in India. Each bag undergoes rigorous quality checks to ensure only the best reaches our customers.'
  },
  {
    name: 'RAVARI Tool Apron - Premium Leather Work Apron',
    slug: 'ravari-tool-apron-premium-leather-work-apron',
    description: 'Professional-grade leather tool apron for craftsmen, gardeners, and DIY enthusiasts. Multiple pockets for organization and tool storage. Heavy-duty construction designed to last for years. Essential for the serious maker.',
    category: 'Accessories',
    price: 1999,
    salePrice: 1499,
    material: ['Heavy Duty Leather', 'Reinforced Stitching', 'Adjustable Straps'],
    color: ['Brown', 'Black'],
    size: ['One Size'],
    stock: 30,
    images: [
      { url: '/images/Ravari Tool Apron (18).png', alt: 'Front View' },
      { url: '/images/Ravari Tool Apron(20).png', alt: 'Pockets Detail' },
      { url: '/images/Ravari Tool Apron(21).png', alt: 'Side View' },
      { url: '/images/Ravari Tool Apron(23).png', alt: 'Worn View' },
      { url: '/images/Ravari Tool Apron(24).png', alt: 'Back View' },
      { url: '/images/Ravari Tool Apron(25).png', alt: 'Strap Detail' }
    ],
    thumbnail: '/images/Ravari Tool Apron (18).png',
    isFeatured: false,
    isNew: true,
    careInstructions: 'Wipe clean after use. Oil occasionally to maintain flexibility and prevent cracking. Dry completely before storage.',
    artisanStory: 'Designed for durability and functionality by craftsmen who understand the needs of working professionals. Every detail is engineered for maximum utility and longevity.'
  }
];

const seedRealProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ravari', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');

    // Insert real products
    const products = await Product.insertMany(realProducts);
    console.log(`✅ Inserted ${products.length} real products`);

    console.log('\n✨ Real Products Added:');
    products.forEach(p => {
      console.log(`  📦 ${p.name} - ₹${p.price}`);
    });

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📊 Admin Dashboard Access:');
    console.log('  URL: http://localhost:3000/admin');
    console.log('  Login: admin@ravari.in / admin123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedRealProducts();
