const mongoose = require("mongoose");

const OrderSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
      required: true,
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
      default: "COD",
    },

    status: {
      type: String,
      default: "Placed",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", OrderSchema);