const crypto = require("crypto");
const Razorpay = require("razorpay");

const Order = require("../models/Order");
const Cart = require("../models/Cart");
const Address = require("../models/Address");

const SHIPPING_CHARGE = 40;
const FALLBACK_IMAGE =
  "https://via.placeholder.com/300x400?text=Product";

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

const getCheckoutData = async (userId) => {
  const cart = await Cart.findOne({ userId }).populate("items.productId");

  if (!cart || cart.items.length === 0) {
    const error = new Error("Cart is empty");
    error.statusCode = 400;
    throw error;
  }

  const address = await Address.findOne({ userId });

  if (!address) {
    const error = new Error("Please add a delivery address");
    error.statusCode = 400;
    throw error;
  }

  const products = cart.items.map((item) => {
    if (!item.productId) {
      const error = new Error("A product in your cart is unavailable");
      error.statusCode = 400;
      throw error;
    }

    return {
      productId: item.productId._id.toString(),
      title: item.productId.title,
      image: item.productId.img?.trim() || FALLBACK_IMAGE,
      price: item.productId.price,
      quantity: item.quantity,
    };
  });

  const subtotal = products.reduce(
    (sum, product) => sum + product.price * product.quantity,
    0
  );

  const amount = subtotal + SHIPPING_CHARGE;

  return {
    cart,
    address,
    products,
    subtotal,
    shipping: SHIPPING_CHARGE,
    amount,
  };
};

// Cash on Delivery
const placeOrder = async (req, res) => {
  try {
    const userId = String(req.body.userId || "");

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const checkout = await getCheckoutData(userId);

    const order = await Order.create({
      userId,
      products: checkout.products,
      subtotal: checkout.subtotal,
      shipping: checkout.shipping,
      amount: checkout.amount,
      address: checkout.address.toObject(),
      paymentMethod: "COD",
      paymentStatus: "PENDING",
      status: "Placed",
    });

    checkout.cart.items = [];
    await checkout.cart.save();

    res.status(201).json(order);
  } catch (err) {
    console.error("Place COD order error:", err);

    res.status(err.statusCode || 500).json({
      message: err.message || "Failed to place order",
    });
  }
};

// Create Razorpay order
const createRazorpayOrder = async (req, res) => {
  let localOrder;

  try {
    const userId = String(req.body.userId || "");

    if (!userId) {
      return res.status(400).json({
        message: "User ID is required",
      });
    }

    const checkout = await getCheckoutData(userId);

    localOrder = await Order.create({
      userId,
      products: checkout.products,
      subtotal: checkout.subtotal,
      shipping: checkout.shipping,
      amount: checkout.amount,
      address: checkout.address.toObject(),
      paymentMethod: "RAZORPAY",
      paymentStatus: "PENDING",
      status: "Payment Pending",
    });

    const razorpayOrder = await razorpay.orders.create({
      amount: Math.round(checkout.amount * 100),
      currency: "INR",
      receipt: localOrder._id.toString(),
      notes: {
        localOrderId: localOrder._id.toString(),
        userId,
      },
    });

    localOrder.razorpayOrderId = razorpayOrder.id;
    await localOrder.save();

    res.status(201).json({
      key: process.env.RAZORPAY_KEY_ID,
      amount: razorpayOrder.amount,
      currency: razorpayOrder.currency,
      razorpayOrderId: razorpayOrder.id,
      localOrderId: localOrder._id,
    });
  } catch (err) {
    console.error("Create Razorpay order error:", err);

    if (localOrder) {
      localOrder.paymentStatus = "FAILED";
      await localOrder.save().catch(() => {});
    }

    res.status(err.statusCode || 500).json({
      message: err.message || "Failed to initiate payment",
    });
  }
};

// Verify Razorpay payment
const verifyRazorpayPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    } = req.body;

    if (
      !razorpay_order_id ||
      !razorpay_payment_id ||
      !razorpay_signature
    ) {
      return res.status(400).json({
        message: "Payment verification details are incomplete",
      });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    const expectedBuffer = Buffer.from(expectedSignature);
    const receivedBuffer = Buffer.from(razorpay_signature);

    const isValid =
      expectedBuffer.length === receivedBuffer.length &&
      crypto.timingSafeEqual(expectedBuffer, receivedBuffer);

    if (!isValid) {
      return res.status(400).json({
        message: "Payment verification failed",
      });
    }

    const order = await Order.findOne({
      razorpayOrderId: razorpay_order_id,
    });

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    if (order.paymentStatus === "PAID") {
      return res.status(200).json({
        message: "Payment already verified",
        order,
      });
    }

    order.razorpayPaymentId = razorpay_payment_id;
    order.razorpaySignature = razorpay_signature;
    order.paymentStatus = "PAID";
    order.status = "Placed";

    await order.save();

    await Cart.findOneAndUpdate(
      { userId: order.userId },
      { $set: { items: [] } }
    );

    res.status(200).json({
      message: "Payment verified successfully",
      order,
    });
  } catch (err) {
    console.error("Verify Razorpay payment error:", err);

    res.status(500).json({
      message: "Failed to verify payment",
    });
  }
};

// Get order history
const getUserOrders = async (req, res) => {
  try {
    const userId = String(req.params.userId);

    const orders = await Order.find({ userId }).sort({
      createdAt: -1,
    });

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
  createRazorpayOrder,
  verifyRazorpayPayment,
  getUserOrders,
};