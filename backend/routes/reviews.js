const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { auth, adminAuth } = require('../middleware/auth');

// Public routes
router.get('/product/:productId', reviewController.getProductReviews);

// Customer routes
router.post('/', auth, reviewController.createReview);
router.get('/my-reviews', auth, reviewController.getUserReviews);
router.put('/:reviewId', auth, reviewController.updateReview);
router.delete('/:reviewId', auth, reviewController.deleteReview);
router.post('/:reviewId/helpful', reviewController.markHelpful);

// Admin routes
router.get('/admin/pending', adminAuth, reviewController.getPendingReviews);
router.put('/admin/:reviewId/status', adminAuth, reviewController.updateReviewStatus);

module.exports = router;
