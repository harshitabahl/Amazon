const router = require("express").Router();
const Product = require("../models/Product");

// GET ALL PRODUCTS
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;

    const skip = (page - 1) * limit;

    const products = await Product.find()
      .skip(skip)
      .limit(limit);

    const total = await Product.countDocuments();

    res.status(200).json({
      products,
      total,
      page,
      pages: Math.ceil(total / limit),
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// ⭐ HERO SLIDER PRODUCTS
router.get("/hero", async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $match: {
            img: { $regex: /^https?:\/\// },
        },
      },
      {
        $sample: {
          size: 5,
        },
      },
    ]);

    res.status(200).json(products);
  } catch (err) {
    res.status(500).json(err);
  }
});
// ================= HOME PAGE DATA =================

router.get("/home", async (req, res) => {
  try {
      const randomProducts = async (category, size = 10) => {
  const match = category
    ? {
        categories: {
          $regex: new RegExp(category, "i"),
        },
        img: { $exists: true, $ne: "", $ne: null },
      }
    : {
        img: {
          $regex: "^http",
        },
      };

  return await Product.aggregate([
    { $match: match },
    { $sample: { size } },
  ]);
};
    const [
      recommended,
      clothing,
      shoes,
      electronics,
      watches,
      bags,
      homeKitchen,
      trending,
    ] = await Promise.all([
      randomProducts(null),
      randomProducts("clothing"),
      randomProducts("shoes"),
      randomProducts("electronics"),
      randomProducts("watches"),
      randomProducts("bags"),
      randomProducts("home and kitchen"),
      randomProducts(null),
    ]);

    res.json({
      recommended,
      clothing,
      shoes,
      electronics,
      watches,
      bags,
      homeKitchen,
      trending,
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// GET SINGLE PRODUCT
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;