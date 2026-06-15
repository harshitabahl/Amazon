const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },

    desc: {
      type: String,
      required: true,
    },

    img: {
      type: String,
      required: true,
    },

    categories: {
      type: [String],
      default: [],
    },

    brand: {
      type: String,
      default: "",
    },

    price: {
      type: Number,
      required: true,
    },

    discountedPrice: {
      type: Number,
      default: 0,
    },

    rating: {
      type: String,
      default: "No rating available",
    },

    inStock: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", ProductSchema);