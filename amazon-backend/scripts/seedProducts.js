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

  /* Electronics */
  if (
    text.includes("electronics") ||
    text.includes("mobile") ||
    text.includes("phone") ||
    text.includes("smartphone") ||
    text.includes("laptop") ||
    text.includes("computer") ||
    text.includes("tablet") ||
    text.includes("camera") ||
    text.includes("headphone") ||
    text.includes("earphone") ||
    text.includes("speaker") ||
    text.includes("tv") ||
    text.includes("television") ||
    text.includes("charger") ||
    text.includes("power bank")
  ) {
    return "Electronics";
  }

  /* Fashion */
  if (
    text.includes("clothing") ||
    text.includes("fashion") ||
    text.includes("shirt") ||
    text.includes("tshirt") ||
    text.includes("t-shirt") ||
    text.includes("jeans") ||
    text.includes("dress") ||
    text.includes("shorts") ||
    text.includes("legging") ||
    text.includes("kurti") ||
    text.includes("saree") ||
    text.includes("shoe") ||
    text.includes("shoes") ||
    text.includes("sandal") ||
    text.includes("bellies") ||
    text.includes("heel") ||
    text.includes("slipper") ||
    text.includes("watch") ||
    text.includes("wallet") ||
    text.includes("bag") ||
    text.includes("handbag") ||
    text.includes("accessories")
  ) {
    return "Fashion";
  }

  /* Home & Kitchen */
  if (
    text.includes("home") ||
    text.includes("kitchen") ||
    text.includes("sofa") ||
    text.includes("bed") ||
    text.includes("chair") ||
    text.includes("table") ||
    text.includes("furniture") ||
    text.includes("mattress") ||
    text.includes("bottle") ||
    text.includes("cookware") ||
    text.includes("utensil")
  ) {
    return "Home & Kitchen";
  }

  /* Beauty */
  if (
    text.includes("beauty") ||
    text.includes("health") ||
    text.includes("shampoo") ||
    text.includes("soap") ||
    text.includes("cream") ||
    text.includes("lotion") ||
    text.includes("face wash") ||
    text.includes("makeup") ||
    text.includes("cosmetic") ||
    text.includes("perfume")
  ) {
    return "Beauty";
  }

  /* Sports */
  if (
    text.includes("sports") ||
    text.includes("fitness") ||
    text.includes("gym") ||
    text.includes("exercise") ||
    text.includes("cricket") ||
    text.includes("football") ||
    text.includes("badminton") ||
    text.includes("cycling") ||
    text.includes("yoga")
  ) {
    return "Sports";
  }

  /* Books */
  if (
    text.includes("book") ||
    text.includes("novel") ||
    text.includes("magazine")
  ) {
    return "Books";
  }

  /* Toys */
  if (
    text.includes("toy") ||
    text.includes("baby") ||
    text.includes("kids") ||
    text.includes("pet")
  ) {
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
        desc:(row.description || row.product_name || "No description available")
        .replace(/<[^>]*>/g, "")
        .replace(/\s+/g, " ")
        .trim()
        .slice(0, 300),
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