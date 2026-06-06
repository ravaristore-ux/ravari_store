const mongoose = require('mongoose');
const Product = require('../models/Product');

const PRODUCTS = [
  // BAGS & HANDBAGS
  {
    name: 'RAVARI Premium Brown Leather Sling Bag',
    slug: 'ravari-premium-brown-leather-sling-bag',
    category: 'Bags & Handbags',
    description: 'Stylish Crossbody Chest Bag with Zipper Pocket | Travel & Daily Use',
    price: 4599,
    salePrice: 2599,
    stock: 15,
    material: ['Genuine Leather'],
    color: ['Brown'],
    size: ['One Size'],
    isNew: false,
    isFeatured: true,
    thumbnail: '/images/Ravari Premium Brown Leather Sling Bag - View 1.png',
    images: [
      { url: '/images/Ravari Premium Brown Leather Sling Bag - View 1.png', alt: 'Product Photo' },
      { url: '/images/Ravari Premium Brown Leather Sling Bag - View 2.png', alt: 'Side View' },
      { url: '/images/Ravari Premium Brown Leather Sling Bag - View 3.png', alt: 'Front View' },
      { url: '/images/Ravari Premium Brown Leather Sling Bag - View 4.png', alt: 'Back View' },
      { url: '/images/Ravari Premium Brown Leather Sling Bag - View 5.png', alt: 'Detail View' }
    ],
    careInstructions: 'Use soft cloth for cleaning, store in dust bag, condition regularly',
    artisanStory: 'Handcrafted by our master artisans with premium Indian leather'
  },
  {
    name: 'RAVARI Vintage Brown Leather Sling Bag',
    slug: 'ravari-vintage-brown-leather-sling-bag',
    category: 'Bags & Handbags',
    description: 'Compact Crossbody Chest Bag with Multi Zipper Pockets | Daily & Travel',
    price: 4599,
    salePrice: 2599,
    stock: 12,
    material: ['Genuine Leather'],
    color: ['Brown'],
    size: ['One Size'],
    isNew: false,
    isFeatured: true,
    thumbnail: '/images/Ravari Vintage Brown Leather Crossbody Bag - View 1.png',
    images: [
      { url: '/images/Ravari Vintage Brown Leather Crossbody Bag - View 1.png', alt: 'Product Photo' },
      { url: '/images/Ravari Vintage Brown Leather Crossbody Bag - View 2.png', alt: 'Side View' },
      { url: '/images/Ravari Vintage Brown Leather Crossbody Bag - View 3.png', alt: 'Front View' },
      { url: '/images/Ravari Vintage Brown Leather Crossbody Bag - View 4.png', alt: 'Back View' },
      { url: '/images/Ravari Vintage Brown Leather Crossbody Bag - View 5.png', alt: 'Detail View' }
    ],
    careInstructions: 'Use soft cloth for cleaning, store in dust bag, condition regularly',
    artisanStory: 'Handcrafted vintage style leather sling bag'
  },
  {
    name: 'Ravari Leather Women Handbag',
    slug: 'ravari-leather-women-handbag',
    category: 'Bags & Handbags',
    description: 'Crocodile-Textured Designer Tote with Braided Flap Closure',
    price: 2799,
    salePrice: 1599,
    stock: 10,
    material: ['Genuine Leather', 'Crocodile Texture'],
    color: ['Brown', 'Black'],
    size: ['Medium'],
    isNew: false,
    isFeatured: false,
    thumbnail: '/images/Ravari Croc-Textured Black Handbag - Product Shot.png',
    images: [
      { url: '/images/Ravari Croc-Textured Black Handbag - Product Shot.png', alt: 'Product Shot' },
      { url: '/images/Ravari Croc-Textured Black Handbag - Lifestyle.png', alt: 'Lifestyle Photo' },
      { url: '/images/Ravari Croc-Textured Black Handbag - Model Shot.png', alt: 'Model Shot' },
      { url: '/images/Ravari Croc-Textured Black Handbag - Features.png', alt: 'Features' },
      { url: '/images/Ravari Croc-Textured Black Handbag - Dimensions.png', alt: 'Dimensions' }
    ],
    careInstructions: 'Wipe with soft cloth, avoid water exposure',
    artisanStory: 'Premium crocodile-textured leather handbag'
  },
  {
    name: 'RAVARI Premium Textured Leather Handbag',
    slug: 'ravari-premium-textured-leather-handbag',
    category: 'Bags & Handbags',
    description: 'Top Handle | Structured Flap Closure Satchel | Multi-Compartment | Work, Travel & Daily Use',
    price: 2999,
    salePrice: 2499,
    stock: 14,
    material: ['Genuine Leather', 'Premium Texture'],
    color: ['Brown', 'Tan'],
    size: ['Large'],
    isNew: true,
    isFeatured: true,
    thumbnail: '/images/Ravari Premium Textured Leather Handbag - View 1.png',
    images: [
      { url: '/images/Ravari Premium Textured Leather Handbag - View 1.png', alt: 'Product Photo' },
      { url: '/images/Ravari Premium Textured Leather Handbag - View 2.jpg', alt: 'Side View' },
      { url: '/images/Ravari Premium Textured Leather Handbag - View 3.jpg', alt: 'Front View' },
      { url: '/images/Ravari Premium Textured Leather Handbag - View 4.png', alt: 'Detail View' }
    ],
    careInstructions: 'Regular conditioning, store in cool dry place',
    artisanStory: 'Masterpiece of leather craftsmanship with structured design'
  },
  {
    name: 'RAVARI Boho-Chic Leather-Trim Tote Bag for Women',
    slug: 'ravari-boho-chic-leather-trim-tote-bag',
    category: 'Bags & Handbags',
    description: 'Boho Tribal Canvas Handbag | Office, Travel & Casual Use',
    price: 4499,
    salePrice: 2499,
    stock: 18,
    material: ['Canvas', 'Genuine Leather Trim'],
    color: ['Multi-Color', 'Beige'],
    size: ['Large'],
    isNew: false,
    isFeatured: true,
    thumbnail: '/images/Ravari Boho-Chic Leather-Trim Tote Bag for Women - View 1.png',
    images: [
      { url: '/images/Ravari Boho-Chic Leather-Trim Tote Bag for Women - View 1.png', alt: 'Product Photo' },
      { url: '/images/Ravari Boho-Chic Leather-Trim Tote Bag for Women - View 2.png', alt: 'Side View' },
      { url: '/images/Ravari Boho-Chic Leather-Trim Tote Bag for Women - View 3.png', alt: 'Front View' },
      { url: '/images/Ravari Boho-Chic Leather-Trim Tote Bag for Women - View 4.png', alt: 'Back View' },
      { url: '/images/Ravari Boho-Chic Leather-Trim Tote Bag for Women - View 5.png', alt: 'Detail View' }
    ],
    careInstructions: 'Hand wash canvas, spot clean leather trim',
    artisanStory: 'Bohemian-inspired tote with authentic leather accents'
  },

  // ORGANIZERS & STORAGE
  {
    name: 'RAVARI Premium Leather Desk Organizer',
    slug: 'ravari-premium-leather-desk-organizer',
    category: 'Organizers & Storage',
    description: 'Pen Stand, Card Holder & Utility Tray | Home & Workspace',
    price: 1299,
    salePrice: 1199,
    stock: 20,
    material: ['Genuine Leather', 'Metal Fittings'],
    color: ['Brown', 'Tan'],
    size: ['Standard'],
    isNew: false,
    isFeatured: false,
    thumbnail: '/images/Ravari Leather Desk Organizer - Product Shot.jpeg',
    images: [
      { url: '/images/Ravari Leather Desk Organizer - Product Shot.jpeg', alt: 'Product Shot' },
      { url: '/images/Ravari Leather Desk Organizer - Lifestyle.jpeg', alt: 'Lifestyle Photo' }
    ],
    careInstructions: 'Dust regularly, condition leather monthly',
    artisanStory: 'Functional desk organizer combining style and utility'
  },
  {
    name: 'RAVARI Leather Jewellery Box Organizer for Women',
    slug: 'ravari-leather-jewellery-box-organizer',
    category: 'Organizers & Storage',
    description: 'Mirror & Drawers | Multi Layer Storage for Rings, Earrings, Necklace | Travel Friendly',
    price: 5499,
    salePrice: 4999,
    stock: 8,
    material: ['Genuine Leather', 'Velvet Lining'],
    color: ['Brown', 'Black'],
    size: ['Medium'],
    isNew: true,
    isFeatured: true,
    thumbnail: '/images/Ravari Leather Jewellery Box - Product Shot.jpeg',
    images: [
      { url: '/images/Ravari Leather Jewellery Box - Product Shot.jpeg', alt: 'Product Shot' },
      { url: '/images/Ravari Leather Jewellery Box - Lifestyle.jpg', alt: 'Lifestyle Photo' },
      { url: '/images/Ravari Leather Jewellery Box - Interior View.jpeg', alt: 'Interior View' },
      { url: '/images/Ravari Leather Jewellery Box - Features.jpeg', alt: 'Features' },
      { url: '/images/Ravari Leather Jewellery Box - Dimensions.jpeg', alt: 'Dimensions' }
    ],
    careInstructions: 'Keep away from moisture, use soft cloth for cleaning',
    artisanStory: 'Premium jewelry organizer with multiple compartments'
  },
  {
    name: "RAVARI Men's & Women's 20-Slot Watch Box",
    slug: 'ravari-20-slot-watch-box',
    category: 'Organizers & Storage',
    description: 'PU Leather, Dark Brown Crocodile-Embossed Texture',
    price: 7999,
    salePrice: 5999,
    stock: 6,
    material: ['PU Leather', 'Crocodile-Embossed'],
    color: ['Dark Brown', 'Black'],
    size: ['Large'],
    isNew: true,
    isFeatured: true,
    thumbnail: '/images/Ravari 12-Slot Leather Watch Box - New Style Ad.jpeg',
    images: [
      { url: '/images/Ravari 12-Slot Leather Watch Box - New Style Ad.jpeg', alt: 'Product Photo' }
    ],
    careInstructions: 'Store in cool, dry place, clean with soft cloth',
    artisanStory: 'Elegant watch organizer for watch enthusiasts'
  },

  // ACCESSORIES
  {
    name: 'RAVARI Premium Leather Key Holder',
    slug: 'ravari-premium-leather-key-holder',
    category: 'Accessories',
    description: 'Zipper Pouch & Metal Keychain | Compact Organizer for Car & Home Keys',
    price: 599,
    salePrice: 499,
    stock: 30,
    material: ['Genuine Leather', 'Metal Keychain'],
    color: ['Brown', 'Black', 'Tan'],
    size: ['Standard'],
    isNew: false,
    isFeatured: false,
    thumbnail: '/images/Ravari Leather Key Holder Zipper Pouch - Product Shot.jpeg',
    images: [
      { url: '/images/Ravari Leather Key Holder Zipper Pouch - Product Shot.jpeg', alt: 'Product Shot' },
      { url: '/images/Ravari Leather Key Holder Zipper Pouch - Lifestyle.jpeg', alt: 'Lifestyle Photo' },
      { url: '/images/Ravari Leather Key Holder Zipper Pouch - Car Keys Lifestyle.jpeg', alt: 'Car Keys Lifestyle' },
      { url: '/images/Ravari Leather Key Holder Zipper Pouch - Features.jpeg', alt: 'Features' },
      { url: '/images/Ravari Leather Key Holder Zipper Pouch - Dimensions.jpeg', alt: 'Dimensions' }
    ],
    careInstructions: 'Wipe clean, store in dry place',
    artisanStory: 'Compact and durable key holder for everyday use'
  },
  {
    name: 'Ravari Ember Travel Folio Leather Wallet',
    slug: 'ravari-ember-travel-folio-leather-wallet',
    category: 'Accessories',
    description: 'Card Slots & Passport Organizer',
    price: 799,
    salePrice: 599,
    stock: 25,
    material: ['Genuine Leather'],
    color: ['Brown', 'Black'],
    size: ['Standard'],
    isNew: false,
    isFeatured: false,
    thumbnail: '/images/Ravari Dual-Tone Organizer Wallet - Product Shot.png',
    images: [
      { url: '/images/Ravari Dual-Tone Organizer Wallet - Product Shot.png', alt: 'Product Shot' },
      { url: '/images/Ravari Dual-Tone Organizer Wallet - Lifestyle.png', alt: 'Lifestyle Photo' },
      { url: '/images/Ravari Dual-Tone Organizer Wallet - Model Shot.png', alt: 'Model Shot' },
      { url: '/images/Ravari Dual-Tone Organizer Wallet - Interior View.png', alt: 'Interior View' },
      { url: '/images/Ravari Dual-Tone Organizer Wallet - Dimensions.png', alt: 'Dimensions' }
    ],
    careInstructions: 'Keep away from moisture, condition regularly',
    artisanStory: 'Travel-friendly wallet with multiple compartments'
  },

  // APPAREL / WORKWEAR
  {
    name: 'RAVARI Artisan Leather Work Apron',
    slug: 'ravari-artisan-leather-work-apron',
    category: 'Apparel & Workwear',
    description: 'Heavy-Duty Multi-Pocket | Electrician, Craft, Barber, Kitchen & Workshop | Adjustable Shoulder Strap',
    price: 2999,
    salePrice: 1899,
    stock: 11,
    material: ['Genuine Leather', 'Canvas'],
    color: ['Brown', 'Tan'],
    size: ['One Size', 'Adjustable'],
    isNew: true,
    isFeatured: false,
    thumbnail: '/images/Ravari Leather Tool Apron - View 1.png',
    images: [
      { url: '/images/Ravari Leather Tool Apron - View 1.png', alt: 'Product Photo' },
      { url: '/images/Ravari Leather Tool Apron - View 2.png', alt: 'Side View' },
      { url: '/images/Ravari Leather Tool Apron - View 3.png', alt: 'Front View' },
      { url: '/images/Ravari Leather Tool Apron - View 4.png', alt: 'Back View' },
      { url: '/images/Ravari Leather Tool Apron - View 5.png', alt: 'Detail View' }
    ],
    careInstructions: 'Spot clean leather, wash canvas as needed',
    artisanStory: 'Professional-grade leather apron for craftspeople'
  }
];

async function seedProducts() {
  try {
    await mongoose.connect('mongodb://localhost:27017/ravari');
    console.log('Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('Cleared existing products');

    // Insert new products
    const created = await Product.insertMany(PRODUCTS);
    console.log(`✅ Successfully seeded ${created.length} products`);

    // Verify
    const count = await Product.countDocuments();
    console.log(`📊 Total products in database: ${count}`);

    // Show summary
    console.log('\n📋 Products with Real Product Photos:');
    created.forEach((product, idx) => {
      console.log(`${idx + 1}. ${product.name}`);
      console.log(`   Thumbnail: ${product.thumbnail}`);
      console.log(`   Images: ${product.images.length} total`);
    });

    await mongoose.disconnect();
    console.log('\n✅ Database seeding complete!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

seedProducts();
