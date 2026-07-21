const Address = require("../models/Address");

// Save a new address
exports.saveAddress = async (req, res) => {
  try {
    const {
      userId,
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
    } = req.body;

    // Check if user already has an address
    const existingAddress = await Address.findOne({ userId });

    if (existingAddress) {
      return res.status(400).json({
        message: "Address already exists. Please update it.",
      });
    }

    const address = await Address.create({
      userId,
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
    });

    res.status(201).json(address);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong.",
    });
  }
};
// Get user's address
exports.getAddress = async (req, res) => {
  try {
    const address = await Address.findOne({
      userId: req.params.userId,
    });

    if (!address) {
      return res.status(404).json({
        message: "No address found.",
      });
    }

    res.json(address);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong.",
    });
  }
};
// Update address
exports.updateAddress = async (req, res) => {
  try {
    const address = await Address.findOneAndUpdate(
      {
        userId: req.params.userId,
      },
      req.body,
      {
        new: true,
      }
    );

    res.json(address);
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Something went wrong.",
    });
  }
};