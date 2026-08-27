const express = require("express");

const {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
} = require("../controllers/wishlistController");

const router = express.Router();

// Get wishlist
router.get("/:userId", getWishlist);

// Add product
router.post("/:userId/:productId", addToWishlist);

// Remove product
router.delete("/:userId/:productId", removeFromWishlist);

module.exports = router;