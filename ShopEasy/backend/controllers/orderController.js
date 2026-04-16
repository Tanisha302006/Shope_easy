const Order = require('../models/Order');
const Cart = require('../models/Cart');

// @desc    Create new order from cart & checkout
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
  try {
    const { shippingAddress } = req.body;

    if (!shippingAddress) {
      return res.status(400).json({ message: 'Shipping address is required' });
    }

    // 1. Fetch user's cart populated with actual product prices
    const cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
      'name price'
    );

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Your cart is empty' });
    }

    // 2. Map cart items to the Order schema format and securely calculate the total on the server
    let totalAmount = 0;
    const orderItems = cart.items.map((item) => {
      // Tally the cost based on trusted database price, not client-provided price
      const itemPrice = item.product.price;
      const quantity = item.quantity;
      totalAmount += itemPrice * quantity;

      return {
        name: item.product.name,
        quantity: quantity,
        price: itemPrice,
        product: item.product._id, // Save reference
      };
    });

    // 3. Create the order
    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      totalAmount: totalAmount.toFixed(2), // Optional: fix to 2 decimals
      orderStatus: 'Pending',
    });

    // 4. Clear the user's cart after successful order creation
    cart.items = [];
    await cart.save();

    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort('-createdAt');
    res.status(200).json(orders);
  } catch (error) {
    next(error);
  }
};

module.exports = {
  createOrder,
  getMyOrders,
};
