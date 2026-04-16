const mongoose = require('mongoose');

const cartItemSchema = mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product', // Links this item to the Product collection
    },
    quantity: {
      type: Number,
      required: true,
      min: [1, 'Quantity must be at least 1'],
      default: 1,
    },
  },
  { _id: false } // Prevent Mongoose from creating a separate _id for each item in the array
);

const cartSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Establishes a one-to-one or one-to-many relationship with the User
    },
    items: [cartItemSchema], // Array of embedded cart items
  },
  {
    timestamps: true,
  }
);

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
