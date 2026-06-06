const Review = require('../models/Review');
const Product = require('../models/Product');

// Create review
exports.createReview = async (req, res) => {
  try {
    const { productId, orderId, rating, title, comment, images } = req.body;

    if (!productId || !rating || !title || !comment) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    if (rating < 1 || rating > 5) {
      return res.status(400).json({ success: false, error: 'Rating must be between 1 and 5' });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' });
    }

    const review = new Review({
      productId,
      userId: req.userId,
      orderId,
      rating,
      title,
      comment,
      images: images || [],
      status: 'pending'
    });

    await review.save();

    res.status(201).json({
      success: true,
      message: 'Review submitted for moderation',
      review
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get product reviews
exports.getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      productId: req.params.productId,
      status: 'approved'
    })
      .populate('userId', 'firstName lastName avatar')
      .sort({ createdAt: -1 });

    // Calculate stats
    const allReviews = await Review.find({
      productId: req.params.productId,
      status: 'approved'
    });

    let stats = {
      averageRating: 0,
      totalReviews: allReviews.length,
      distribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };

    if (allReviews.length > 0) {
      const totalRating = allReviews.reduce((sum, r) => sum + r.rating, 0);
      stats.averageRating = Math.round((totalRating / allReviews.length) * 10) / 10;

      allReviews.forEach(r => {
        stats.distribution[r.rating]++;
      });
    }

    res.json({ success: true, reviews, stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get user's reviews
exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ userId: req.userId })
      .populate('productId', 'name slug thumbnail')
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Update review
exports.updateReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }

    if (review.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    Object.assign(review, req.body);
    review.status = 'pending';
    await review.save();

    res.json({ success: true, message: 'Review updated', review });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Delete review
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }

    if (review.userId.toString() !== req.userId) {
      return res.status(403).json({ success: false, error: 'Not authorized' });
    }

    await Review.findByIdAndDelete(req.params.reviewId);

    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Mark helpful (admin)
exports.markHelpful = async (req, res) => {
  try {
    const review = await Review.findByIdAndUpdate(
      req.params.reviewId,
      { $inc: { helpful: 1 } },
      { new: true }
    );
    res.json({ success: true, review });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Get pending reviews (admin)
exports.getPendingReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ status: 'pending' })
      .populate('userId', 'firstName lastName')
      .populate('productId', 'name slug')
      .sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

// Approve/Reject review (admin)
exports.updateReviewStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, error: 'Invalid status' });
    }

    const review = await Review.findByIdAndUpdate(
      req.params.reviewId,
      { status },
      { new: true }
    );

    if (!review) {
      return res.status(404).json({ success: false, error: 'Review not found' });
    }

    // Update product rating if approved
    if (status === 'approved') {
      const stats = await Review.aggregate([
        { $match: { productId: review.productId, status: 'approved' } },
        {
          $group: {
            _id: null,
            avgRating: { $avg: '$rating' },
            count: { $sum: 1 }
          }
        }
      ]);

      if (stats.length > 0) {
        await Product.findByIdAndUpdate(review.productId, {
          rating: Math.round(stats[0].avgRating * 10) / 10,
          reviewCount: stats[0].count
        });
      }
    }

    res.json({ success: true, message: 'Review status updated', review });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
