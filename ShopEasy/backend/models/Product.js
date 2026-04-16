const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a product name'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please add a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please add a price'],
      min: [0, 'Price must be a positive number'],
    },
    category: {
      type: String,
      required: [true, 'Please specify a category'],
    },
    image: {
      type: String,
      required: [true, 'Please add an image URL'],
      default: '/images/sample.jpg',
    },
    stock: {
      type: Number,
      required: [true, 'Please add stock quantity'],
      min: [0, 'Stock cannot be negative'],
      default: 0,
    },
    rating: {
      type: Number,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating cannot exceed 5'],
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
