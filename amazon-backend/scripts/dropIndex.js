const mongoose = require("mongoose");
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI).then(async () => {
  const db = mongoose.connection.db;

  await db.collection("products").dropIndex("title_1");

  console.log("✅ title_1 index removed");

  process.exit();
});