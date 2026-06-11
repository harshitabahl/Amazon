const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const cookieParser = require("cookie-parser");

const authRoute = require("./routes/auth");

const app = express();

// ---------------- MIDDLEWARE ----------------
app.use(express.json());
app.use(cookieParser());

// IMPORTANT: CORS for cookies
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

// ---------------- ROUTES ----------------
app.use("/api/auth", authRoute);

// ---------------- DB CONNECT ----------------
mongoose
  .connect("mongodb://localhost:27017/amazonclone")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

// ---------------- SERVER ----------------
app.listen(5000, () => {
  console.log("Server running on port 5000");
});