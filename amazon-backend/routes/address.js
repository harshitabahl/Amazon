const express = require("express");
const router = express.Router();

const {
  saveAddress,
  getAddress,
  updateAddress,
} = require("../controllers/addressController");

router.post("/", saveAddress);

router.get("/:userId", getAddress);

router.put("/:userId", updateAddress);


module.exports = router;