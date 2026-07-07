const mongoose = require("mongoose");
const Product = require("../models/Product");
require("dotenv").config();

async function addTags() {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    const products = await Product.find({});

    console.log(`Found ${products.length} products`);

    for (const p of products) {
      const text = `${p.title} ${p.desc} ${(p.categories || []).join(" ")}`
        .toLowerCase();

      let tags = [];

      // Phones
      if (
        text.includes("iphone") ||
        text.includes("phone") ||
        text.includes("mobile")
      ) {
        tags.push("phone");
      }

      // Fashion
      if (
        text.includes("shirt") ||
        text.includes("t-shirt") ||
        text.includes("tshirt") ||
        text.includes("jeans")
      ) {
        tags.push("fashion");
      }

      // Audio
      if (
        text.includes("headphone") ||
        text.includes("earphone") ||
        text.includes("earbud") ||
        text.includes("airpod")
      ) {
        tags.push("audio");
      }

      // Home
      if (
        text.includes("curtain") ||
        text.includes("kitchen") ||
        text.includes("mixer")
      ) {
        tags.push("home");
      }

      await Product.findByIdAndUpdate(
        p._id,
        {
          $set: { tags },
        },
        { new: true }
      );
    }

    console.log("🎉 Tags added successfully!");

    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

addTags();