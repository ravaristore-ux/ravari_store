const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const reviewController = require('../controllers/reviewController');

// Product routes
router.get('/', productController.getProducts);
router.post('/', productController.createProduct);
router.get('/featured', productController.getFeaturedProducts);
router.get('/new', productController.getNewArrivals);
router.get('/categories/list', productController.getCategories);
router.get('/slug/:slug', productController.getProductBySlug);
router.get('/:id', productController.getProductById);
router.put('/:id', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);
router.get('/:id/similar', productController.getSimilarProducts);

// Review routes for products
router.get('/:productId/reviews', reviewController.getProductReviews);

module.exports = router;
