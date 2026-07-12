const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    desc: {
      type: String,
      default: "",
    },

    imageBroken: {
      type: Boolean,
      default: false,
    },

    img: {
      type: String,
      default: "https://via.placeholder.com/300x400?text=Product",
    },

    productUrl: {
      type: String,
      default: "",
      index: true,
    },

    source: {
      type: String,
      default: "Snapdeal",
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

    inventory: {
      type: Number,
      default: 100,
      min: 0,
    },

    tags: {
      type: [String],
      default: [],
    },

    attributes: {
      type: Map,
      of: String,
      default: {},
    },

    // ⭐ NEW
    detailsScraped: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", ProductSchema);