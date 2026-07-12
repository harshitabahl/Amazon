const Product = require("../models/Product");

const getFilters = async (req, res) => {
  try {
    const {
      search = "",
      category = "",
      minPrice,
      maxPrice,
    } = req.query;

    // Build filter
    const query = {};

    if (search) {
      query.title = {
        $regex: search,
        $options: "i",
      };
    }

    if (category) {
      query.categories = category;
    }

    if (minPrice || maxPrice) {
      query.price = {};

      if (minPrice !== "") {
        query.price.$gte = Number(minPrice);
      }

      if (maxPrice !== "") {
        query.price.$lte = Number(maxPrice);
      }
    }

    // ================= Categories =================
    const categories = await Product.aggregate([
      {
        $match: query,
      },
      {
        $unwind: "$categories",
      },
      {
        $group: {
          _id: "$categories",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $match: {
          count: { $gte: 2 },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
    ]);

    // ================= Brands =================
    const brands = await Product.aggregate([
      {
        $match: {
          ...query,
          brand: {
            $exists: true,
            $ne: "",
          },
        },
      },
      {
        $group: {
          _id: "$brand",
          count: {
            $sum: 1,
          },
        },
      },
      {
        $match: {
          count: { $gte: 2 },
        },
      },
      {
        $sort: {
          count: -1,
        },
      },
      {
        $limit: 15,
      },
    ]);

    res.status(200).json({
      success: true,
      filters: {
        categories: categories.map((c) => ({
          name: c._id,
          count: c.count,
        })),
        brands: brands.map((b) => ({
          name: b._id,
          count: b.count,
        })),
      },
    });
  } catch (err) {
    console.error(err);

    res.status(500).json({
      success: false,
      message: "Failed to fetch filters",
    });
  }
};

module.exports = {
  getFilters,
};