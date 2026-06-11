const mongoose = require("mongoose");
const Product = require("./models/Product");

mongoose.connect(process.env.MONGO_URI || "mongodb+srv://Harshita:Reema_bahl2006@harshita.4ix40r5.mongodb.net/amazon?retryWrites=true&w=majority");

const colors = ["red", "blue", "black", "white", "green"];
const sizes = ["S", "M", "L", "XL"];
const categories = ["shirt", "shoes", "jeans", "watch", "bag"];

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

async function seed() {
  try {
    console.log("🚀 Seeding started...");

    const batchSize = 10000; // important for performance
    const total = 500000;

    for (let i = 0; i < total; i += batchSize) {
      const batch = [];

      for (let j = 0; j < batchSize; j++) {
        batch.push({
          title: `Product ${i + j}`,
          desc: "High quality product",
          img: "https://via.placeholder.com/300",
          categories: [random(categories)],
          size: [random(sizes)],
          color: [random(colors)],
          price: Math.floor(Math.random() * 5000) + 100,
        });
      }

      await Product.insertMany(batch);
      console.log(`Inserted: ${i + batchSize} / ${total}`);
    }

    console.log("🔥 DONE: 5 LAKH PRODUCTS CREATED");
    process.exit();
  } catch (err) {
    console.log(err);
  }
}

seed();