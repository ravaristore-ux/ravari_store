const express = require('express');
const router = express.Router();
const Wishlist = require('../models/Wishlist');
const { auth } = require('../middleware/auth');

// Get wishlist
router.get('/', auth, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.userId })
      .populate('items.productId');

    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.userId, items: [] });
      await wishlist.save();
    }

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Add to wishlist
router.post('/add/:productId', auth, async (req, res) => {
  try {
    let wishlist = await Wishlist.findOne({ userId: req.userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId: req.userId, items: [] });
    }

    const exists = wishlist.items.some(item => item.productId.toString() === req.params.productId);
    if (!exists) {
      wishlist.items.push({ productId: req.params.productId });
    }

    await wishlist.save();
    await wishlist.populate('items.productId');

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Remove from wishlist
router.delete('/remove/:productId', auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.userId });

    if (!wishlist) {
      return res.status(404).json({ error: 'Wishlist not found' });
    }

    wishlist.items = wishlist.items.filter(item => item.productId.toString() !== req.params.productId);
    await wishlist.save();
    await wishlist.populate('items.productId');

    res.json(wishlist);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Check if product in wishlist
router.get('/check/:productId', auth, async (req, res) => {
  try {
    const wishlist = await Wishlist.findOne({ userId: req.userId });

    if (!wishlist) {
      return res.json({ inWishlist: false });
    }

    const inWishlist = wishlist.items.some(item => item.productId.toString() === req.params.productId);
    res.json({ inWishlist });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
