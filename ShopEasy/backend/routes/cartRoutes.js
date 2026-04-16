const express = require('express');
const router = express.Router();
const {
  getUserCart,
  addToCart,
  updateCartItem,
  removeFromCart,
} = require('../controllers/cartController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getUserCart)
  .post(protect, addToCart);

router.route('/:productId')
  .put(protect, updateCartItem)
  .delete(protect, removeFromCart);

module.exports = router;
