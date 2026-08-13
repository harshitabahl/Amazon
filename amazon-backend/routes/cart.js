const router = require("express").Router();
const Cart = require("../models/Cart");

// ================= ADD TO CART =================
router.post("/", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({
        userId,
        items: [
          {
            productId,
            quantity: 1,
          },
        ],
      });

      return res.status(201).json(cart);
    }

    const existingItem = cart.items.find(
      (item) => item.productId.toString() === productId
    );

    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.items.push({
        productId,
        quantity: 1,
      });
    }

    await cart.save();

    res.status(200).json(cart);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to add item to cart",
    });
  }
});

// ================= GET CART =================
router.get("/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({
      userId: req.params.userId,
    }).populate("items.productId");

    if (!cart) {
      return res.json({
        userId: req.params.userId,
        items: [],
      });
    }

    res.status(200).json(cart);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to fetch cart",
    });
  }
});

// ================= INCREASE QUANTITY =================
router.patch("/increase", async (req, res) => {
  try {
    console.log("PATCH /increase hit");
    console.log("Request Body:", req.body);

    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    console.log("Cart Items:", cart.items);

    const item = cart.items.find(
      (i) => i.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    item.quantity += 1;

    await cart.save();

    res.status(200).json(cart);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to increase quantity",
    });
  }
});

// ================= DECREASE QUANTITY =================
router.patch("/decrease", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (i) => i.productId.toString() === productId
    );

    if (!item) {
      return res.status(404).json({
        message: "Item not found",
      });
    }

    if (item.quantity > 1) {
      item.quantity -= 1;
    } else {
      cart.items = cart.items.filter(
        (i) => i.productId.toString() !== productId
      );
    }

    await cart.save();

    res.status(200).json(cart);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to decrease quantity",
    });
  }
});

// ================= DELETE ITEM =================
router.delete("/remove", async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await cart.save();

    res.status(200).json(cart);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to delete item",
    });
  }
});

// ================= CLEAR CART =================
router.delete("/clear/:userId", async (req, res) => {
  try {
    const cart = await Cart.findOne({
      userId: req.params.userId,
    });

    if (!cart) {
      return res.status(404).json({
        message: "Cart not found",
      });
    }

    cart.items = [];

    await cart.save();

    res.status(200).json({
      message: "Cart cleared successfully",
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      message: "Failed to clear cart",
    });
  }
});
module.exports = router;