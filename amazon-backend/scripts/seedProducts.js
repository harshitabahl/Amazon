const mongoose = require("mongoose");
const csv = require("csv-parser");
const fs = require("fs");

const CATEGORIES = require("../constants/categories");
const IMAGE_POOLS = require("../constants/imagePools");
const Product = require("../models/Product");

require("dotenv").config();

/* ---------------- CONNECT DB ---------------- */
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ Mongo Error:", err));

/* ---------------- IMAGE SELECTOR ---------------- */
function getImage(category, seed) {
  const pool = IMAGE_POOLS[category] || IMAGE_POOLS["Gadgets"];
  return pool[seed % pool.length];
}

/* ---------------- CATEGORY NORMALIZER ---------------- */

function normalizeCategory(raw) {
  if (!raw) return "Gadgets";

  const text = raw.toLowerCase();

  if (text.includes("electronics")) return "Electronics";

  if (text.includes("clothing") || text.includes("fashion") || text.includes("accessories")) {
    return "Fashion";
  }

  if (text.includes("home") || text.includes("kitchen")) {
    return "Home & Kitchen";
  }

  if (text.includes("beauty") || text.includes("health")) {
    return "Beauty";
  }

  if (text.includes("sports")) {
    return "Sports";
  }

  if (text.includes("baby") || text.includes("pet")) {
    return "Toys";
  }

  return "Gadgets";
}
/* ---------------- DATA STORAGE ---------------- */
const products = [];

/* ---------------- READ CSV ---------------- */
fs.createReadStream("dataset.csv")
  .pipe(csv())
  .on("data", (row) => {
    try {
      let category = normalizeCategory(
        row.product_category_tree || row.product_name
      );

      // ensure category is valid
      if (!CATEGORIES.includes(category)) {
        category = "Gadgets";
      }

      products.push({
        title: row.product_name || "Untitled Product",
        desc: row.description || row.product_name || "No description available",

        // FINAL IMAGE SYSTEM (Unsplash)
        img: getImage(category, products.length),

        categories: [category],

        brand: row.brand || "",
        price: Number(row.retail_price) || 0,
        discountedPrice: Number(row.discounted_price) || 0,
        rating: row.product_rating || "No rating available",
        inStock: true,
      });

    } catch (err) {
      console.log("Row Error:", err);
    }
  })

  /* ---------------- INSERT INTO DB ---------------- */
  .on("end", async () => {
    try {
      console.log(`Found ${products.length} products`);

      await Product.deleteMany({});

      await Product.insertMany(products.slice(0, 5000));

      console.log("✅ 5000 products inserted successfully");

      process.exit();
    } catch (err) {
      console.log("Insert Error:", err);
      process.exit(1);
    }
  });