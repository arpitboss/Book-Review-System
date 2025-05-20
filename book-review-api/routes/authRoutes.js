const express = require('express');
const router = express.Router();
const { register, login, getMe } = require('../controllers/authController');
const { registerValidator, loginValidator, validate } = require('../middleware/validators');
const { protect } = require('../middleware/auth');

// Public routes
router.post('/signup', registerValidator, validate, register);
router.post('/login', loginValidator, validate, login);

// Protected routes
router.get('/me', protect, getMe);

module.exports = router;