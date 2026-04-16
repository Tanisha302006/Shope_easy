const Product = require('../models/Product');

// @desc    Fetch all products (with optional search, filter, and sort capabilities)
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res, next) => {
  try {
    const { keyword, category, sort } = req.query;

    // 1. Search Query Handling (Partial match on product name)
    const searchQuery = keyword
      ? {
          name: {
            $regex: keyword,
            $options: 'i', // Case-insensitive
          },
        }
      : {};

    // 2. Filter Category Query Handling (Exact match)
    const categoryQuery = category ? { category } : {};

    // Combine both search and filter queries
    const query = { ...searchQuery, ...categoryQuery };

    // 3. Sorting Mechanism
    // Example: ?sort=price (Ascending) | ?sort=-price (Descending)
    const sortBy = sort ? sort : '-createdAt'; // Defaults to newest first

    // Execute the database request
    const products = await Product.find(query).sort(sortBy);

    res.status(200).json(products);
  } catch (error) {
    next(error);
  }
};

// @desc    Fetch a single product by its ID
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.status(200).json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new product (Admin level mostly, left simple for Demo)
// @route   POST /api/products
// @access  Public / Admin
const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(req.body);

    if (product) {
      res.status(201).json(product);
    } else {
      res.status(400).json({ message: 'Invalid product data provided' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Update a specific product
// @route   PUT /api/products/:id
// @access  Public / Admin
const updateProduct = async (req, res, next) => {
  try {
    // Look for product by ID and map the request body to update it
    // { new: true } returns the updated document, runValidators ensures schema fits
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (updatedProduct) {
      res.status(200).json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found, unable to update' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a specific product
// @route   DELETE /api/products/:id
// @access  Public / Admin
const deleteProduct = async (req, res, next) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (deletedProduct) {
      res.status(200).json({ message: 'Product successfully removed' });
    } else {
      res.status(404).json({ message: 'Product not found, unable to delete' });
    }
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
