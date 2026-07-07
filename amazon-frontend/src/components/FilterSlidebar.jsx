function FilterSidebar({ products, filters, setFilters }) {
  const brands = [...new Set(products.map((p) => p.brand).filter(Boolean))];

  const categories = [
    ...new Set(products.flatMap((p) => p.categories || [])),
  ];

  const toggleBrand = (brand) => {
    if (filters.brands.includes(brand)) {
      setFilters({
        ...filters,
        brands: filters.brands.filter((b) => b !== brand),
      });
    } else {
      setFilters({
        ...filters,
        brands: [...filters.brands, brand],
      });
    }
  };

  const setPrice = (min, max) => {
    setFilters({
      ...filters,
      minPrice: min,
      maxPrice: max,
    });
  };

  const clearFilters = () => {
    setFilters({
      category: "",
      brands: [],
      minPrice: "",
      maxPrice: "",
      sort: "featured",
    });
  };

  return (
    <aside className="filters">
      <div className="filter-header">
        <h2>Filters</h2>

        <button
          className="clear-btn"
          onClick={clearFilters}
        >
          Clear All
        </button>
      </div>

      {/* CATEGORY */}

      <div className="filter-section">
        <h3>Category</h3>

        {categories.map((cat) => (
          <label key={cat} className="filter-item">
            <input
              type="radio"
              name="category"
              checked={filters.category === cat}
              onChange={() =>
                setFilters({
                  ...filters,
                  category: cat,
                })
              }
            />

            <span>{cat}</span>
          </label>
        ))}
      </div>

      {/* BRAND */}

      <div className="filter-section">
        <h3>Brand</h3>

        {brands.map((brand) => (
          <label
            key={brand}
            className="filter-item"
          >
            <input
              type="checkbox"
              checked={filters.brands.includes(
                brand
              )}
              onChange={() =>
                toggleBrand(brand)
              }
            />

            <span>{brand}</span>
          </label>
        ))}
      </div>

      {/* PRICE */}

      <div className="filter-section">
        <h3>Price</h3>

        <button onClick={() => setPrice("", 500)}>
          Under ₹500
        </button>

        <button onClick={() => setPrice(500, 1000)}>
          ₹500 - ₹1000
        </button>

        <button onClick={() => setPrice(1000, 5000)}>
          ₹1000 - ₹5000
        </button>

        <button onClick={() => setPrice(5000, "")}>
          Above ₹5000
        </button>

        <button
          className="clear-btn"
          onClick={() => setPrice("", "")}
        >
          Clear Price
        </button>
      </div>
    </aside>
  );
}

export default FilterSidebar;