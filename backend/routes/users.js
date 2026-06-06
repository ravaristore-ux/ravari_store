const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth } = require('../middleware/auth');

// Auth routes
router.post('/register', userController.register);
router.post('/login', userController.login);

// Protected routes
router.get('/me', auth, userController.getCurrentUser);
router.put('/profile', auth, userController.updateProfile);
router.post('/change-password', auth, userController.changePassword);

// Address routes
router.post('/addresses', auth, userController.addAddress);
router.put('/addresses/:addressId', auth, userController.updateAddress);
router.delete('/addresses/:addressId', auth, userController.deleteAddress);

module.exports = router;
