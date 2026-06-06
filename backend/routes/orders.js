const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth, adminAuth } = require('../middleware/auth');

// Order routes
router.post('/', auth, orderController.createOrder);
router.get('/', auth, orderController.getUserOrders);
router.get('/:orderId', auth, orderController.getOrderById);
router.put('/:orderId/payment', auth, orderController.updatePaymentStatus);
router.put('/:orderId/cancel', auth, orderController.cancelOrder);

// Admin routes
router.get('/admin/all', adminAuth, orderController.getAllOrders);
router.put('/admin/:orderId', adminAuth, orderController.updateOrderStatus);
router.get('/admin/stats', adminAuth, orderController.getDashboardStats);

module.exports = router;
