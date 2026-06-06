const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const User = require('../models/User');

dotenv.config();

const sampleProducts = [
  {
    name: 'Premium Leather Wallet',
    slug: 'premium-leather-wallet',
    description: 'Handcrafted genuine leather wallet with multiple compartments',
    category: 'Wallets',
    price: 2999,
    salePrice: 2499,
    material: ['Genuine Leather'],
    color: ['Black', 'Brown', 'Tan'],
    size: ['One Size'],
    stock: 25,
    thumbnail: '/images/wallet-1.jpg',
    images: [
      { url: '/images/wallet-1.jpg', alt: 'Premium Leather Wallet - Front' },
      { url: '/images/wallet-2.jpg', alt: 'Premium Leather Wallet - Back' }
    ],
    isFeatured: true,
    isNew: false,
    careInstructions: 'Clean with soft cloth. Condition regularly with leather cream.'
  },
  {
    name: 'Crossbody Leather Bag',
    slug: 'crossbody-leather-bag',
    description: 'Elegant crossbody bag perfect for everyday use',
    category: 'Bags',
    price: 8999,
    salePrice: 7499,
    material: ['Genuine Leather', 'Canvas'],
    color: ['Black', 'Coffee Brown', 'Deep Blue'],
    size: ['Medium'],
    stock: 15,
    thumbnail: '/images/bag-1.jpg',
    images: [
      { url: '/images/bag-1.jpg', alt: 'Crossbody Bag - Front' }
    ],
    isFeatured: true,
    isNew: true,
    careInstructions: 'Keep away from direct sunlight. Store in dust bag when not in use.'
  },
  {
    name: 'Premium Belt',
    slug: 'premium-belt',
    description: 'Classic leather belt with solid brass buckle',
    category: 'Belts',
    price: 1999,
    salePrice: null,
    material: ['Full Grain Leather'],
    color: ['Black', 'Brown', 'Cognac'],
    size: ['30', '32', '34', '36', '38', '40'],
    stock: 40,
    thumbnail: '/images/belt-1.jpg',
    images: [
      { url: '/images/belt-1.jpg', alt: 'Premium Belt' }
    ],
    isFeatured: false,
    isNew: false
  },
  {
    name: 'Leather Passport Holder',
    slug: 'leather-passport-holder',
    description: 'Compact passport holder with card slots',
    category: 'Travel',
    price: 899,
    salePrice: 799,
    material: ['Genuine Leather'],
    color: ['Black', 'Brown'],
    size: ['One Size'],
    stock: 30,
    thumbnail: '/images/passport-1.jpg',
    images: [
      { url: '/images/passport-1.jpg', alt: 'Passport Holder' }
    ],
    isFeatured: false,
    isNew: true
  },
  {
    name: 'Leather Briefcase',
    slug: 'leather-briefcase',
    description: 'Professional leather briefcase for business travel',
    category: 'Bags',
    price: 12999,
    salePrice: 10999,
    material: ['Full Grain Leather'],
    color: ['Black', 'Brown'],
    size: ['One Size'],
    stock: 8,
    thumbnail: '/images/briefcase-1.jpg',
    images: [
      { url: '/images/briefcase-1.jpg', alt: 'Leather Briefcase' }
    ],
    isFeatured: true,
    isNew: false,
    isLimitedEdition: true
  }
];

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ravari', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await User.deleteMany({});

    console.log('🗑️ Cleared existing data');

    // Insert products
    const products = await Product.insertMany(sampleProducts);
    console.log(`✅ Inserted ${products.length} products`);

    // Create admin user
    const adminUser = new User({
      firstName: 'Admin',
      lastName: 'User',
      email: 'admin@ravari.in',
      password: 'admin123', // Will be hashed
      role: 'admin',
      phone: '+919876543210'
    });

    await adminUser.save();
    console.log('✅ Created admin user (email: admin@ravari.in, password: admin123)');

    // Create sample customer
    const customerUser = new User({
      firstName: 'John',
      lastName: 'Doe',
      email: 'customer@ravari.in',
      password: 'customer123', // Will be hashed
      role: 'customer',
      phone: '+919876543211',
      addresses: [{
        type: 'home',
        street: '123 Main Street',
        city: 'Delhi',
        state: 'Delhi',
        postalCode: '110001',
        country: 'India',
        isDefault: true
      }]
    });

    await customerUser.save();
    console.log('✅ Created sample customer (email: customer@ravari.in, password: customer123)');

    console.log('\n✨ Database seeding completed successfully!');
    console.log('\nYou can now login with:');
    console.log('Admin: admin@ravari.in / admin123');
    console.log('Customer: customer@ravari.in / customer123');

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedData();
