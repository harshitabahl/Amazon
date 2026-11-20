const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
      index: true,
    },

    products: [
      {
        productId: {
          type: String,
          required: true,
        },
        title: {
          type: String,
          required: true,
        },
        image: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        quantity: {
          type: Number,
          default: 1,
        },
      },
    ],

    subtotal: {
      type: Number,
      required: true,
    },

    shipping: {
      type: Number,
      default: 40,
    },

    amount: {
      type: Number,
      required: true,
    },

    address: {
      type: Object,
      required: true,
    },

    paymentMethod: {
      type: String,
      enum: ["COD", "RAZORPAY"],
      default: "COD",
    },

    paymentStatus: {
      type: String,
      enum: ["PENDING", "PAID", "FAILED"],
      default: "PENDING",
    },

    razorpayOrderId: {
      type: String,
      default: null,
    },

    razorpayPaymentId: {
      type: String,
      default: null,
    },

    razorpaySignature: {
      type: String,
      default: null,
    },

    status: {
      type: String,
      enum: [
        "Payment Pending",
        "Placed",
        "Confirmed",
        "Shipped",
        "Out for Delivery",
        "Delivered",
        "Cancelled",
      ],
      default: "Placed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);