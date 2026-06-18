require("dotenv").config();
const mongoose = require("mongoose");

const Product = require("../models/Product");
const scrapeSnapdeal = require("./snapdeal");
const scrapeASOS = require("./asos");

(async () => {
  try {
    console.log("🚀 Running all scrapers...");

    // ✅ FIX: CONNECT DB HERE
    await mongoose.connect(process.env.MONGO_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("✅ MongoDB Connected");

    let snapdeal = await scrapeSnapdeal();
    let asos = await scrapeASOS();

    let all = [...snapdeal, ...asos];

    const clean = all.map(p => ({
      title: p.title || "No title",
      desc: p.title || "",
      img: p.image || "",
      imageBroken: !p.image,
      categories: ["fashion"],
      brand: "",
      price: Number((p.price || "0").replace(/[^0-9]/g, "")),
      discountedPrice: 0,
      rating: "No rating",
      inStock: true,
      url: p.url,
      source: p.source
    }));

    console.log("Total before insert:", clean.length);

    // ✅ OPTIONAL: batch insert (safer)
    await Product.insertMany(clean, { ordered: false });

    console.log("🔥 INSERTED INTO MONGO DB");

    await mongoose.disconnect();
  } catch (err) {
    console.log("❌ ERROR:", err.message);
  }
})();