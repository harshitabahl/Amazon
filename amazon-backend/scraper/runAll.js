require("dotenv").config();
const mongoose = require("mongoose");

const Product = require("../models/Product");
const scrapeSnapdeal = require("./snapdeal");

function getCategory(title = "") {
  const t = title.toLowerCase();

  if (/(shoe|sneaker|boot|loafer|heel|sandal|slipper)/.test(t))
    return "shoes";

  if (/(watch|smartwatch)/.test(t))
    return "watches";

  if (/(bag|backpack|wallet|handbag)/.test(t))
    return "bags";

  if (/(lipstick|perfume|makeup|cream|face wash|shampoo)/.test(t))
    return "beauty";

  if (
    /(phone|mobile|laptop|earbuds|headphones|speaker|keyboard|mouse|charger)/.test(
      t
    )
  )
    return "electronics";

  if (
  /(kitchen|cookware|utensil|pan|pot|bottle|flask|mug|cup|plate|spoon|fork|knife|container|storage|bedsheet|blanket|pillow|curtain|lamp|clock|decor|mat)/.test(
    t
  )
)
  return "home and kitchen";

  if (/(football|cricket|gym|yoga|badminton)/.test(t))
    return "sports";

  if (/(toy|lego|doll|puzzle)/.test(t))
    return "toys";

  return "clothing";
}

(async () => {
  try {
    console.log("🚀 Running Snapdeal scraper...");

    await mongoose.connect(process.env.MONGO_URI);

    console.log("✅ MongoDB Connected");

    const products = await scrapeSnapdeal();

    console.log(`📦 Raw Products: ${products.length}`);

    const clean = products
      .filter((p) => p.title && p.price)
      .map((p) => ({
        title: p.title.trim(),

        desc: p.title,

        img:
          p.image && p.image.startsWith("http")
            ? p.image
            : "https://via.placeholder.com/400x500?text=No+Image",

        imageBroken: false,

        categories: [getCategory(p.title)],

        brand: "",

        price:
          Number(
            String(p.price)
              .replace(/,/g, "")
              .replace(/[^0-9]/g, "")
          ) || 0,

        discountedPrice: 0,

        rating: "No rating",

        inStock: true,
      }));

    console.log(`📦 Clean Products: ${clean.length}`);

    let inserted = 0;
    let skipped = 0;

    for (const product of clean) {
      const result = await Product.updateOne(
        {
          title: product.title,
          price: product.price,
        },
        {
          $setOnInsert: product,
        },
        {
          upsert: true,
        }
      );

      if (result.upsertedCount > 0) {
        inserted++;
      } else {
        skipped++;
      }
    }

    console.log("\n==============================");
    console.log(`✅ Inserted : ${inserted}`);
    console.log(`⏭️ Skipped : ${skipped}`);
    console.log("==============================");

    await mongoose.disconnect();

    console.log("🎉 DONE");
  } catch (err) {
    console.error("❌ ERROR:", err);
    process.exit(1);
  }
})();