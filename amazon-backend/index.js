const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const productRoute = require("./routes/product");
const authRoute = require("./routes/auth");

require("dotenv").config();

const app = express();

/* Serve product images */
app.use(
  "/product-images",
  express.static(
    path.join(__dirname, "public/product-images")
  )
);

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  })
);

app.get("/", (req, res) => {
  res.send("Backend working");
});

app.use(express.json());
app.use(cookieParser());

app.use("/api/auth", authRoute);
app.use("/api/products", productRoute);

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ Mongo Error:", err.message));

app.listen(5001, () => {
  console.log("Server running on port 5001");
});