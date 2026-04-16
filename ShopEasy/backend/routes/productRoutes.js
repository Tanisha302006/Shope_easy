const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/productController');

// Mappings for base path: /api/products
router.route('/')
  .get(getProducts)
  .post(createProduct);

// Mappings for distinct entity path: /api/products/:id
router.route('/:id')
  .get(getProductById)
  .put(updateProduct)
  .delete(deleteProduct);

module.exports = router;
