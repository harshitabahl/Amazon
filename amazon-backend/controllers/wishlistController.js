const Wishlist = require("../models/wishlist");
const Product = require("../models/Product");

// ================= GET WISHLIST =================

const getWishlist = async (req, res) => {
  try {
    const userId = String(req.params.userId);

    const wishlist = await Wishlist.findOne({ userId }).populate(
      "products"
    );

    if (!wishlist) {
      return res.status(200).json({
        products: [],
      });
    }

    res.status(200).json({
      products: wishlist.products,
    });
  } catch (err) {
    console.error("Get wishlist error:", err);

    res.status(500).json({
      message: "Failed to fetch wishlist",
      error: err.message,
    });
  }
};

// ================= ADD TO WISHLIST =================

const addToWishlist = async (req, res) => {
  try {
    const userId = String(req.params.userId);
    const productId = String(req.params.productId);

    if (!userId || !productId) {
      return res.status(400).json({
        message: "userId and productId are required",
      });
    }

    // Check product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    // Find wishlist
    let wishlist = await Wishlist.findOne({ userId });

    // Create wishlist
    if (!wishlist) {
      wishlist = await Wishlist.create({
        userId,
        products: [productId],
      });
    } else {
      // Check duplicate
      const alreadyExists = wishlist.products.some(
        (id) => id.toString() === productId
      );

      if (alreadyExists) {
        return res.status(200).json({
          message: "Product already in wishlist",
          wishlist,
        });
      }

      wishlist.products.push(productId);

      await wishlist.save();
    }

    const updatedWishlist = await Wishlist.findById(
      wishlist._id
    ).populate("products");

    res.status(200).json({
      message: "Product added to wishlist",
      wishlist: updatedWishlist,
    });
  } catch (err) {
    console.error("Add wishlist error:", err);

    res.status(500).json({
      message: "Failed to add product to wishlist",
      error: err.message,
    });
  }
};

// ================= REMOVE FROM WISHLIST =================

const removeFromWishlist = async (req, res) => {
  try {
    const userId = String(req.params.userId);
    const productId = String(req.params.productId);

    const wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      return res.status(404).json({
        message: "Wishlist not found",
      });
    }

    wishlist.products = wishlist.products.filter(
      (id) => id.toString() !== productId
    );

    await wishlist.save();

    const updatedWishlist = await Wishlist.findById(
      wishlist._id
    ).populate("products");

    res.status(200).json({
      message: "Product removed from wishlist",
      wishlist: updatedWishlist,
    });
  } catch (err) {
    console.error("Remove wishlist error:", err);

    res.status(500).json({
      message: "Failed to remove product from wishlist",
      error: err.message,
    });
  }
};

module.exports = {
  getWishlist,
  addToWishlist,
  removeFromWishlist,
};