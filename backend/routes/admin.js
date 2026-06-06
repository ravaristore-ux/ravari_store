const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const orderController = require('../controllers/orderController');
const reviewController = require('../controllers/reviewController');
const { adminAuth } = require('../middleware/auth');

// Product management routes
router.post('/products', adminAuth, productController.createProduct);
router.put('/products/:id', adminAuth, productController.updateProduct);
router.delete('/products/:id', adminAuth, productController.deleteProduct);

// Order management routes
router.get('/orders', adminAuth, orderController.getAllOrders);
router.put('/orders/:orderId', adminAuth, orderController.updateOrderStatus);

// Review management routes
router.get('/reviews/pending', adminAuth, reviewController.getPendingReviews);
router.put('/reviews/:reviewId/status', adminAuth, reviewController.updateReviewStatus);

// Dashboard route
router.get('/stats', adminAuth, orderController.getDashboardStats);

module.exports = router;
