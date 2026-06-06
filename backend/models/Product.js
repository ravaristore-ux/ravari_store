const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    index: true
  },
  slug: {
    type: String,
    unique: true,
    lowercase: true,
    index: true
  },
  description: String,
  longDescription: String,
  category: {
    type: String,
    required: true,
    index: true
  },
  subcategory: String,
  price: {
    type: Number,
    required: true
  },
  salePrice: Number,
  material: [String],
  color: [String],
  size: [String],
  dimensions: {
    length: String,
    width: String,
    height: String,
    weight: String
  },
  careInstructions: String,
  stock: {
    type: Number,
    default: 0
  },
  images: [{
    url: String,
    alt: String,
    order: Number
  }],
  thumbnail: String,
  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0
  },
  reviewCount: {
    type: Number,
    default: 0
  },
  artisanStory: String,
  artisanImage: String,
  isNew: {
    type: Boolean,
    default: false
  },
  isLimitedEdition: {
    type: Boolean,
    default: false
  },
  isFeatured: {
    type: Boolean,
    default: false
  },
  tags: [String],
  seoTitle: String,
  seoDescription: String,
  seoKeywords: [String],
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Index for search
productSchema.index({ name: 'text', description: 'text', category: 'text' });

// Index for filtering
productSchema.index({ category: 1, price: 1 });
productSchema.index({ isFeatured: 1, createdAt: -1 });

module.exports = mongoose.model('Product', productSchema);
