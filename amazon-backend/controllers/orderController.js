const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Address = require("../models/Address");

const placeOrder = async (req, res) => {
  try {
    const { userId } = req.body;

    // Get user's cart
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({
        message: "Cart is empty",
      });
    }

    // Get user's saved address
    const address = await Address.findOne({ userId });

    if (!address) {
      return res.status(400).json({
        message: "Address not found",
      });
    }

   const FALLBACK_IMAGE =
  "https://via.placeholder.com/300x400?text=Product";

const products = cart.items.map((item) => {
  const image =
    item.productId.img?.trim() || FALLBACK_IMAGE;
  return {
    productId: item.productId._id.toString(),
    title: item.productId.title,
    image,
    price: item.productId.price,
    quantity: item.quantity,
  };
});


    const amount = cart.items.reduce(
      (sum, item) =>
        sum + item.productId.price * item.quantity,
      0
    );

    const order = await Order.create({
      userId,
      products,
      amount,
      address,
      paymentMethod: "COD",
    });

    res.status(201).json(order);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to place order",
    });
  }
};
const getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 });

    res.status(200).json(orders);
  } catch (err) {
    console.error("Get orders error:", err);

    res.status(500).json({
      message: "Failed to fetch orders",
    });
  }
};

module.exports = {
  placeOrder,
  getUserOrders,
};