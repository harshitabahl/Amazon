const express = require("express");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

const productRoute = require("./routes/product");

// middleware
app.use(express.json());

// routes
app.use("/api/products", productRoute);

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected 🚀"))
  .catch((err) => console.log("DB Error:", err));

app.get("/", (req, res) => {
  res.send("Backend is running 🚀");
});

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});