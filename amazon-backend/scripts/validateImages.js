const mongoose = require("mongoose");
const axios = require("axios");
const Product = require("../models/Product");

const MONGO_URI = process.env.MONGO_URI || "YOUR_MONGODB_URI";

async function isImageValid(url) {
  try {
    const response = await axios.get(url, {
      timeout: 5000,
      responseType: "stream",
      validateStatus: () => true,
    });

    return (
      response.status === 200 &&
      response.headers["content-type"]?.startsWith("image/")
    );
  } catch (err) {
    return false;
  }
}

async function validateImages() {
  await mongoose.connect(MONGO_URI);

  const products = await Product.find();

  let broken = 0;

  for (const product of products) {
    const valid = await isImageValid(product.img);

    if (!valid) {
      broken++;

      console.log(`❌ ${product.title}`);

      await Product.updateOne(
        { _id: product._id },
        {
          $set: {
            imageBroken: true,
          },
        }
      );
    }
  }

  console.log(`Finished. Broken Images: ${broken}`);

  mongoose.disconnect();
}

validateImages();