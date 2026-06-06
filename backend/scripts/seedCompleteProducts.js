const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('../models/Product');
const fs = require('fs');
const path = require('path');

dotenv.config();

const completeProducts = [
  {
    name: 'RAVARI Premium Textured Leather Handbag',
    slug: 'ravari-premium-textured-leather-handbag',
    description: 'Exquisite premium textured leather handbag with elegant design and multiple compartments. Perfect for everyday use or special occasions. Hand-selected genuine leather with superior craftsmanship.',
    category: 'Handbags',
    price: 4999,
    salePrice: 3999,
    material: ['Premium Genuine Leather', 'Textured Finish', 'Gold-Toned Hardware'],
    color: ['Brown', 'Black', 'Tan'],
    size: ['Large'],
    stock: 15,
    images: [
      { url: '/images/Ravari Premium Textured Leather Handbag - View 1.png', alt: 'Front View' },
      { url: '/images/Ravari Premium Textured Leather Handbag - View 2.jpg', alt: 'Side View' },
      { url: '/images/Ravari Premium Textured Leather Handbag - View 3.jpg', alt: 'Detail View' },
      { url: '/images/Ravari Premium Textured Leather Handbag - View 4.png', alt: 'Full View' }
    ],
    thumbnail: '/images/Ravari Premium Textured Leather Handbag - View 1.png',
    isFeatured: true,
    isNew: true,
    careInstructions: 'Wipe with soft cloth. Avoid direct sunlight. Store in dust bag. Condition leather quarterly with premium leather conditioner.',
    artisanStory: 'Handcrafted by master artisans with decades of experience in luxury leather goods manufacturing. Each piece is uniquely created and made with unwavering passion for perfection. The textured finish is carefully applied to create an exclusive pattern that ages beautifully over time.'
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
      { url: '/images/Ravari Premium Brown Leather Sling Bag - View 1.png', alt: 'Front View' },
      { url: '/images/Ravari Premium Brown Leather Sling Bag - View 2.png', alt: 'Side View' },
      { url: '/images/Ravari Premium Brown Leather Sling Bag - View 3.png', alt: 'Back View' },
      { url: '/images/Ravari Premium Brown Leather Sling Bag - View 4.png', alt: 'Detail View' },
      { url: '/images/Ravari Premium Brown Leather Sling Bag - View 5.png', alt: 'Worn Style' },
      { url: '/images/Ravari Premium Brown Leather Sling Bag - View 6.png', alt: 'Interior View' },
      { url: '/images/Ravari Premium Brown Leather Sling Bag - View 7.png', alt: 'Strap Detail' }
    ],
    thumbnail: '/images/Ravari Premium Brown Leather Sling Bag - View 1.png',
    isFeatured: true,
    isNew: false,
    careInstructions: 'Apply leather conditioner regularly. Store in cool, dry place. Keep away from water and excessive heat. Use dust bag for storage.',
    artisanStory: 'Premium leather sourced from finest tanneries in India. Each bag undergoes rigorous quality checks to ensure only the best reaches our customers. Designed for the modern traveler who values both style and functionality.'
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
      { url: '/images/Ravari Boho-Chic Leather-Trim Tote Bag for Women - View 1.png', alt: 'Front View' },
      { url: '/images/Ravari Boho-Chic Leather-Trim Tote Bag for Women - View 2.png', alt: 'Side View' },
      { url: '/images/Ravari Boho-Chic Leather-Trim Tote Bag for Women - View 3.png', alt: 'Detail View' },
      { url: '/images/Ravari Boho-Chic Leather-Trim Tote Bag for Women - View 4.png', alt: 'Bottom View' },
      { url: '/images/Ravari Boho-Chic Leather-Trim Tote Bag for Women - View 5.png', alt: 'Worn Style' },
      { url: '/images/Ravari Boho-Chic Leather-Trim Tote Bag for Women - View 6.png', alt: 'Interior View' }
    ],
    thumbnail: '/images/Ravari Boho-Chic Leather-Trim Tote Bag for Women - View 1.png',
    isFeatured: false,
    isNew: true,
    careInstructions: 'Machine wash cold. Air dry. Condition leather trim as needed. Keep out of direct sunlight. Use breathable storage bag.',
    artisanStory: 'Eco-friendly and ethically produced with commitment to sustainability. We partner with artisans who share our values of quality and environmental responsibility. Perfect for conscious consumers who want style without compromise.'
  },
  {
    name: 'RAVARI Vintage Brown Leather Crossbody Bag',
    slug: 'ravari-vintage-brown-leather-crossbody-bag',
    description: 'Compact crossbody sling bag with multiple zippered compartments. Perfect for travel and daily use. Vintage aesthetic with modern functionality. Timeless design that complements any style.',
    category: 'Sling Bags',
    price: 2999,
    salePrice: 2299,
    material: ['Vintage Leather', 'Premium Quality', 'YKK Zippers'],
    color: ['Brown', 'Black', 'Cognac'],
    size: ['Medium'],
    stock: 25,
    images: [
      { url: '/images/Ravari Vintage Brown Leather Crossbody Bag - View 1.png', alt: 'Front View' },
      { url: '/images/Ravari Vintage Brown Leather Crossbody Bag - View 2.png', alt: 'Side View' },
      { url: '/images/Ravari Vintage Brown Leather Crossbody Bag - View 3.png', alt: 'Back View' },
      { url: '/images/Ravari Vintage Brown Leather Crossbody Bag - View 4.png', alt: 'Detail View' },
      { url: '/images/Ravari Vintage Brown Leather Crossbody Bag - View 5.png', alt: 'Strap Detail' }
    ],
    thumbnail: '/images/Ravari Vintage Brown Leather Crossbody Bag - View 1.png',
    isFeatured: true,
    isNew: false,
    careInstructions: 'Clean with leather conditioner monthly. Keep away from moisture and extreme heat. Use dust bag when storing. Allow leather to develop natural patina.',
    artisanStory: 'Each piece reflects traditional craftsmanship passed down through generations. Our artisans use time-tested techniques to create bags that age beautifully. The vintage aesthetic is achieved through careful selection and treatment of premium hides.'
  },
  {
    name: 'RAVARI Croc-Textured Black Handbag',
    slug: 'ravari-croc-textured-black-handbag',
    description: 'Sophisticated croc-textured black handbag with premium leather construction. Statement piece combining elegance with edgy style. Perfect for formal events or upscale casual wear.',
    category: 'Handbags',
    price: 5499,
    salePrice: 4299,
    material: ['Premium Leather', 'Croc-Textured Surface', 'Platinum Hardware'],
    color: ['Black'],
    size: ['Large'],
    stock: 12,
    images: [
      { url: '/images/Ravari Croc-Textured Black Handbag - Product Shot.png', alt: 'Product Shot' },
      { url: '/images/Ravari Croc-Textured Black Handbag - Model Shot.png', alt: 'Model Shot' },
      { url: '/images/Ravari Croc-Textured Black Handbag - Lifestyle.png', alt: 'Lifestyle' },
      { url: '/images/Ravari Croc-Textured Black Handbag - Features.png', alt: 'Features' },
      { url: '/images/Ravari Croc-Textured Black Handbag - Dimensions.png', alt: 'Dimensions' }
    ],
    thumbnail: '/images/Ravari Croc-Textured Black Handbag - Product Shot.png',
    isFeatured: true,
    isNew: true,
    careInstructions: 'Treat like fine leather. Wipe clean with soft cloth. Use premium leather conditioner. Store in cool, dark place. Handle with care to maintain texture.',
    artisanStory: 'An expression of bold sophistication. The croc-texture is hand-applied to create an authentic crocodile-like appearance using premium embossing techniques. Designed for women who make a statement.'
  },
  {
    name: 'RAVARI Leather Tool Apron',
    slug: 'ravari-leather-tool-apron',
    description: 'Professional-grade leather tool apron for craftsmen, gardeners, and DIY enthusiasts. Multiple pockets for organization. Heavy-duty construction designed to last for years. Essential for the serious maker.',
    category: 'Accessories',
    price: 1999,
    salePrice: 1499,
    material: ['Heavy Duty Leather', 'Reinforced Stitching', 'Adjustable Straps'],
    color: ['Brown', 'Black'],
    size: ['One Size'],
    stock: 30,
    images: [
      { url: '/images/Ravari Leather Tool Apron - View 1.png', alt: 'Front View' },
      { url: '/images/Ravari Leather Tool Apron - View 2.png', alt: 'Pockets Detail' },
      { url: '/images/Ravari Leather Tool Apron - View 3.png', alt: 'Side View' },
      { url: '/images/Ravari Leather Tool Apron - View 4.png', alt: 'Worn View' },
      { url: '/images/Ravari Leather Tool Apron - View 5.png', alt: 'Back View' },
      { url: '/images/Ravari Leather Tool Apron - View 6.png', alt: 'Strap Detail' }
    ],
    thumbnail: '/images/Ravari Leather Tool Apron - View 1.png',
    isFeatured: false,
    isNew: true,
    careInstructions: 'Wipe clean after use. Oil occasionally to maintain flexibility and prevent cracking. Dry completely before storage. The leather will develop a rich patina over time.',
    artisanStory: 'Designed for durability and functionality by craftsmen who understand the needs of working professionals. Every detail is engineered for maximum utility and longevity. Built to become a trusted tool in your workshop.'
  },
  {
    name: 'RAVARI Dual-Tone Organizer Wallet',
    slug: 'ravari-dual-tone-organizer-wallet',
    description: 'Premium dual-tone leather organizer wallet with multiple compartments for cards, bills, and coins. Perfect for those who prefer organization and style. Compact yet spacious design.',
    category: 'Accessories',
    price: 1799,
    salePrice: 1299,
    material: ['Premium Leather', 'Dual Tone Finish', 'Metal Hardware'],
    color: ['Brown & Black', 'Tan & Brown'],
    size: ['Standard'],
    stock: 22,
    images: [
      { url: '/images/Ravari Dual-Tone Organizer Wallet - Product Shot.png', alt: 'Product Shot' },
      { url: '/images/Ravari Dual-Tone Organizer Wallet - Model Shot.png', alt: 'Model Shot' },
      { url: '/images/Ravari Dual-Tone Organizer Wallet - Lifestyle.png', alt: 'Lifestyle' },
      { url: '/images/Ravari Dual-Tone Organizer Wallet - Dimensions.png', alt: 'Dimensions' },
      { url: '/images/Ravari Dual-Tone Organizer Wallet - Interior View.png', alt: 'Interior View' }
    ],
    thumbnail: '/images/Ravari Dual-Tone Organizer Wallet - Product Shot.png',
    isFeatured: false,
    isNew: true,
    careInstructions: 'Wipe with soft cloth. Keep away from moisture. Condition leather regularly. Store in cool place. The dual-tone leather will develop unique character over time.',
    artisanStory: 'A marriage of functionality and style. The dual-tone design is achieved through careful leather selection and skilled craftsmanship. Each wallet is unique with its own color variations.'
  },
  {
    name: 'RAVARI Leather Key Holder Zipper Pouch',
    slug: 'ravari-leather-key-holder-zipper-pouch',
    description: 'Compact leather key holder with zipper pouch and premium craftsmanship. Keep your keys organized and protected. Perfect gift for leather enthusiasts.',
    category: 'Accessories',
    price: 899,
    salePrice: 649,
    material: ['Premium Leather', 'YKK Zipper', 'Metal Keyring'],
    color: ['Brown', 'Black', 'Tan'],
    size: ['Standard'],
    stock: 40,
    images: [
      { url: '/images/Ravari Leather Key Holder Zipper Pouch - Product Shot.jpeg', alt: 'Product Shot' },
      { url: '/images/Ravari Leather Key Holder Zipper Pouch - Lifestyle.jpeg', alt: 'Lifestyle' },
      { url: '/images/Ravari Leather Key Holder Zipper Pouch - Car Keys Lifestyle.jpeg', alt: 'Car Keys Use' },
      { url: '/images/Ravari Leather Key Holder Zipper Pouch - Features.jpeg', alt: 'Features' },
      { url: '/images/Ravari Leather Key Holder Zipper Pouch - Dimensions.jpeg', alt: 'Dimensions' }
    ],
    thumbnail: '/images/Ravari Leather Key Holder Zipper Pouch - Product Shot.jpeg',
    isFeatured: false,
    isNew: false,
    careInstructions: 'Keep dry. Wipe with soft cloth occasionally. Condition leather to maintain suppleness. The zipper ensures keys stay secure.',
    artisanStory: 'Small in size but big on quality. This key holder is perfect for those who appreciate fine craftsmanship in everyday items. Makes an excellent gift for anyone who values premium leather goods.'
  },
  {
    name: 'RAVARI Leather Jewellery Box',
    slug: 'ravari-leather-jewellery-box',
    description: 'Elegant leather jewellery box with compartments for organizing precious items. Premium craftsmanship perfect for storing rings, necklaces, bracelets, and earrings.',
    category: 'Accessories',
    price: 2499,
    salePrice: 1899,
    material: ['Premium Leather', 'Velvet Interior', 'Brass Hinges'],
    color: ['Brown', 'Black'],
    size: ['Standard'],
    stock: 16,
    images: [
      { url: '/images/Ravari Leather Jewellery Box - Product Shot.jpeg', alt: 'Product Shot' },
      { url: '/images/Ravari Leather Jewellery Box - Interior View.jpeg', alt: 'Interior View' },
      { url: '/images/Ravari Leather Jewellery Box - Lifestyle.jpg', alt: 'Lifestyle' },
      { url: '/images/Ravari Leather Jewellery Box - Features.jpeg', alt: 'Features' },
      { url: '/images/Ravari Leather Jewellery Box - Dimensions.jpeg', alt: 'Dimensions' }
    ],
    thumbnail: '/images/Ravari Leather Jewellery Box - Product Shot.jpeg',
    isFeatured: false,
    isNew: true,
    careInstructions: 'Wipe with soft cloth. Keep in cool, dry place. Velvet interior protects jewelry. Condition leather annually. Do not expose to extreme heat or humidity.',
    artisanStory: 'A luxury storage solution for precious memories. The velvet interior is carefully selected to protect your jewelry while the premium leather exterior showcases expert craftsmanship. Perfect for heirlooms and special pieces.'
  },
  {
    name: 'RAVARI Leather Desk Organizer',
    slug: 'ravari-leather-desk-organizer',
    description: 'Premium leather desk organizer for keeping your workspace tidy and stylish. Multiple compartments for pens, cards, and small items. Perfect for home office or professional setting.',
    category: 'Accessories',
    price: 3299,
    salePrice: 2499,
    material: ['Premium Leather', 'Suede Lined', 'Brass Details'],
    color: ['Brown', 'Black'],
    size: ['Standard'],
    stock: 14,
    images: [
      { url: '/images/Ravari Leather Desk Organizer - Product Shot.jpeg', alt: 'Product Shot' },
      { url: '/images/Ravari Leather Desk Organizer - Lifestyle.jpeg', alt: 'Lifestyle' }
    ],
    thumbnail: '/images/Ravari Leather Desk Organizer - Product Shot.jpeg',
    isFeatured: false,
    isNew: true,
    careInstructions: 'Dust regularly with soft cloth. Keep away from direct sunlight. Condition leather occasionally. The suede lining adds elegance and protection.',
    artisanStory: 'Transform your desk into a statement of style and organization. This organizer combines functionality with luxury, perfect for professionals who appreciate quality. Each piece showcases premium craftsmanship.'
  },
  {
    name: 'RAVARI 12-Slot Leather Watch Box',
    slug: 'ravari-12-slot-leather-watch-box',
    description: 'Sophisticated 12-slot leather watch box for organizing and displaying your timepiece collection. Premium construction with individual slots to protect each watch.',
    category: 'Accessories',
    price: 4999,
    salePrice: 3799,
    material: ['Premium Leather', 'Velvet Slots', 'Glass Display', 'Brass Hardware'],
    color: ['Brown', 'Black'],
    size: ['Standard'],
    stock: 10,
    images: [
      { url: '/images/Ravari 12-Slot Leather Watch Box - New Style Ad.jpeg', alt: 'Product Display' }
    ],
    thumbnail: '/images/Ravari 12-Slot Leather Watch Box - New Style Ad.jpeg',
    isFeatured: false,
    isNew: true,
    careInstructions: 'Wipe glass with soft cloth. Keep in cool, dry place. Do not expose to extreme temperatures. Velvet slots protect watch bands and glass faces.',
    artisanStory: 'For the watch collector who demands the best. This luxury storage solution protects and displays your valuable timepieces. The craftsmanship is evident in every detail, from the velvet slots to the brass hardware.'
  }
];

const seedCompleteProducts = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ravari', {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });

    console.log('✅ Connected to MongoDB');

    // Clear existing products
    await Product.deleteMany({});
    console.log('🗑️ Cleared existing products');

    // Insert all products
    const products = await Product.insertMany(completeProducts);
    console.log(`✅ Inserted ${products.length} complete products`);

    console.log('\n✨ Complete Products Added:');
    products.forEach(p => {
      console.log(`  📦 ${p.name} - ₹${p.price} (${p.images.length} images)`);
    });

    console.log('\n🎉 Database seeding completed successfully!');
    console.log(`\n📊 Total Products: ${products.length}`);
    console.log('📊 Total Product Images: ' + products.reduce((sum, p) => sum + p.images.length, 0));

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding error:', error);
    process.exit(1);
  }
};

seedCompleteProducts();
