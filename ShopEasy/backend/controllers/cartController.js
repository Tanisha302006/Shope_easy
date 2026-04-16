const Cart = require('../models/Cart');

// @desc    Get logged in user's cart
// @route   GET /api/cart
// @access  Private
const getUserCart = async (req, res, next) => {
  try {
    // Find cart and populate the referenced products to get name, price, and image
    let cart = await Cart.findOne({ user: req.user._id }).populate(
      'items.product',
      'name price image'
    );

    // If no cart exists, create an empty one for the user
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Add product to cart
// @route   POST /api/cart
// @access  Private
const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    // Ensure cart exists
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      // Product exists in cart, update quantity
      cart.items[itemIndex].quantity += Number(quantity);
    } else {
      // Product does not exist, add it to array
      cart.items.push({ product: productId, quantity: Number(quantity) });
    }

    await cart.save();

    res.status(200).json(cart);
  } catch (error) {
    next(error);
  }
};

// @desc    Update single product quantity in cart
// @route   PUT /api/cart/:productId
// @access  Private
const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    const itemIndex = cart.items.findIndex(
      (item) => item.product.toString() === productId
    );

    if (itemIndex > -1) {
      cart.items[itemIndex].quantity = Number(quantity);
      await cart.save();
      res.status(200).json(cart);
    } else {
      res.status(404).json({ message: 'Item not found in cart' });
    }
  } catch (error) {
    next(error);
  }
};

// @desc    Remove product from cart
// @route   DELETE /api/cart/:productId
// @access  Private
const removeFromCart = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Filter out the item to be removed
    cart.items = cart.items.filter(
      (item) => item.product.toString() !== productId
    );

    await cart.save();
    res.status(200).json({ message: 'Item removed from cart', cart });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUserCart,
  addToCart,
  updateCartItem,
  removeFromCart,
};
