const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

require("dotenv").config();

const authRoute = require("./routes/auth");
const app = express();

// ✅ CORS FIRST
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


// ✅ Body + cookies
app.use(express.json());
app.use(cookieParser());

// ROUTES
app.use("/api/auth", authRoute);

// MongoDB CONNECT (ONLY ONCE)
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.log("❌ Mongo Error:", err.message));

// server
app.listen(5001, () => {
  console.log("Server running on port 5001");
});