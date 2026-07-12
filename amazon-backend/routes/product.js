const router = require("express").Router();
const Product = require("../models/Product");

// ================= GET ALL PRODUCTS =================
// ================= HERO PRODUCTS =================
router.get("/hero", async (req, res) => {
  try {
    const products = await Product.aggregate([
      {
        $match: {
          img: { $regex: /^https?:\/\// },
        },
      },
      {
        $sample: { size: 5 },
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
            img: { $exists: true, $ne: "" },
          }
        : {
            img: { $regex: "^http" },
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

router.get("/suggest", async (req, res) => {
  try {
    const q = (req.query.q || "").trim().toLowerCase();
    if (!q) return res.json([]);

    const products = await Product.find({
      title: { $regex: "^" + q, $options: "i" } // ONLY prefix match
    })
    .limit(20);

    const results = products
      .map(p => ({
        id: p._id,
        title: p.title,
        img: p.img,
      }))
      .slice(0, 8);

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ================= SEARCH PRODUCTS =================
router.get("/search", async (req, res) => {
  try {
    const query = (req.query.q || "").trim().toLowerCase();
    if (!query) return res.json([]);

    const tokens = query.split(/\s+/).filter(Boolean);

    const products = await Product.find({});

    const isPhoneQuery = ["iphone", "phone", "mobile", "android", "samsung"]
      .some(t => query.includes(t));

    const isShirtQuery = ["shirt", "tshirt", "t-shirt"]
      .some(t => query.includes(t));

    const accessories = [
      "case","cover","tempered","glass","charger","cable","adapter","selfie","stand"
    ];

    function score(p) {
      const title = (p.title || "").toLowerCase();
      const desc = (p.desc || "").toLowerCase();
      const brand = (p.brand || "").toLowerCase();
      const categories = (p.categories || []).join(" ").toLowerCase();

      let s = 0;

      // ================= EXACT =================
      if (title === query) return 100000;

      // ================= STRONG PREFIX =================
      if (title.startsWith(query)) s += 10000;

      // ================= INTENT BOOST =================

      if (isPhoneQuery) {
        if (title.includes("iphone") || categories.includes("phone")) {
          s += 20000;
        }

        if (accessories.some(a => title.includes(a))) {
          s -= 15000;
        }
      }

      if (isShirtQuery) {
        if (title.includes("shirt") || categories.includes("shirt")) {
          s += 20000;
        }

        if (title.includes("hoodie") || title.includes("sweater")) {
          s -= 10000;
        }
      }

      // ================= TOKEN MATCH =================
      tokens.forEach(t => {
        if (title.includes(t)) s += 2000;
        if (categories.includes(t)) s += 1200;
        if (brand.includes(t)) s += 800;
        if (desc.includes(t)) s += 200;
      });

      // ================= PRIORITY RULE =================
      // ENSURE exact category matches win
      if (categories.includes("shirt") && isShirtQuery) s += 5000;
      if (categories.includes("phone") && isPhoneQuery) s += 5000;

      return s;
    }

    const results = products
      .map(p => ({ ...p._doc, score: score(p) }))
      .filter(p => p.score > 0)
      .sort((a, b) => {
        if (b.score !== a.score) return b.score - a.score;

        // fallback: newer first
        return new Date(b.createdAt) - new Date(a.createdAt);
      })
      .slice(0, 50);

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/", async (req, res) => {
  try {
    const {
      page = 1,
      limit = 24,
      search = "",
      category = "",
      brands = "",
      minPrice,
      maxPrice,
      rating,
      discount,
      inStock,
      sort = "featured",
    } = req.query;

    const filter = {};

    // Search
    if (search) {
      filter.title = {
        $regex: search,
        $options: "i",
      };
    }

      // Category
      console.log("Category from frontend:", category);

      if (category) {
        filter.categories = category;
      }

      console.log("Final filter:", filter);

    // Category

    // Brand
    if (brands) {
      filter.brand = {
        $in: brands.split(","),
      };
    }

    // Price
    if (minPrice || maxPrice) {
      filter.price = {};

      if (minPrice !== "")
        filter.price.$gte = Number(minPrice);

      if (maxPrice !== "")
        filter.price.$lte = Number(maxPrice);
    }

        // Discount
    if (discount === "true") {
      filter.$expr = {
        $gt: ["$discountedPrice", 0],
      };
    }

    // Stock (only if stock exists in schema)
    if (inStock === "true") {
      filter.inStock = true;
    }

    if (inStock === "false") {
      filter.inStock = false;
    }

    let sortOption = {};

    switch (sort) {
      case "priceLow":
        sortOption = { price: 1 };
        break;

      case "priceHigh":
        sortOption = { price: -1 };
        break;

      case "rating":
        sortOption = { rating: -1 };
        break;

      case "newest":
        sortOption = { createdAt: -1 };
        break;

      case "title":
        sortOption = { title: 1 };
        break;

      default:
        sortOption = {};
    }

    let products = await Product.find(filter).sort(sortOption);

    // Apply fake rating filter
    if (rating) {
      products = products.filter((product) => {
        const productRating =
          4 + ((Number(product.price) || 299) % 10) / 10;

        return productRating >= Number(rating);
      });
    }

    const total = products.length;

    // Pagination after filtering
    products = products.slice(
      (page - 1) * Number(limit),
      page * Number(limit)
    );

    res.json({
      products,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      message: "Failed to fetch products",
    });
  }
});
// ================= GET SINGLE PRODUCT =================
router.get("/:id", async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    res.status(200).json(product);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;