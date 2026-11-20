const express = require("express");

const {
  placeOrder,
  createRazorpayOrder,
  verifyRazorpayPayment,
  getUserOrders,
} = require("../controllers/orderController");

const router = express.Router();

router.post("/", placeOrder);
router.post("/razorpay/create", createRazorpayOrder);
router.post("/razorpay/verify", verifyRazorpayPayment);
router.get("/:userId", getUserOrders);

module.exports = router;