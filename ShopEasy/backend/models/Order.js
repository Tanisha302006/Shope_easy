const mongoose = require('mongoose');

const orderItemSchema = mongoose.Schema(
  {
    name: { type: String, required: true },
    quantity: { type: Number, required: true, min: 1 },
    price: { type: Number, required: true },
    product: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'Product', // Relates the ordered item to the core Product
    },
  },
  { _id: false }
);

const orderSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User', // Associates this order with a specific User
    },
    items: [orderItemSchema], // Snapshot of items at time of purchase
    shippingAddress: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      state: { type: String, required: true },
      postalCode: { type: String, required: true },
      country: { type: String, required: true },
    },
    totalAmount: {
      type: Number,
      required: true,
      default: 0.0,
    },
    orderStatus: {
      type: String,
      required: true,
      enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
      default: 'Pending',
    },
  },
  {
    timestamps: true,
  }
);

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
