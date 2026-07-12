require("dotenv").config();

const mongoose = require("mongoose");
const Product = require("../models/Product");

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);

    const result = await Product.updateMany(
      { inventory: { $exists: false } },
      {
        $set: {
          inventory: 100,
        },
      }
    );

    console.log(
      `✅ Updated ${result.modifiedCount} products`
    );

    await mongoose.disconnect();
  } catch (err) {
    console.error(err);
  }
})();