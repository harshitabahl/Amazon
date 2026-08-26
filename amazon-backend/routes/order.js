const express = require("express");

const {
  placeOrder,
  getUserOrders,
} = require("../controllers/orderController");

const router = express.Router();

// Place a new order
router.post("/", placeOrder);

// Get all orders for a user
router.get("/:userId", getUserOrders);

module.exports = router;