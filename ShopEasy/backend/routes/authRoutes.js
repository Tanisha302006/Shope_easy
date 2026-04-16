const express = require('express');
const router = express.Router();
const { registerUser, loginUser, getMe } = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Endpoint: POST /api/auth/register
router.post('/register', registerUser);

// Endpoint: POST /api/auth/login
router.post('/login', loginUser);

// Endpoint: GET /api/auth/me (Protected Route)
router.get('/me', protect, getMe);

module.exports = router;
