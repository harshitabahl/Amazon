import { useState } from "react";

function FilterSidebar({
  filterData,
  filters,
  setFilters,
}) {
  const brands = filterData.brands || [];
  const categories = filterData.categories || [];

  const [showAllBrands, setShowAllBrands] = useState(false);
  const [showAllCategories, setShowAllCategories] = useState(false);

  const visibleBrands = showAllBrands
    ? brands
    : brands.slice(0, 10);

  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, 10);

  const updateFilters = (changes) => {
    setFilters((prev) => ({
      ...prev,
      ...changes,
    }));
  };

  const toggleBrand = (brand) => {
    updateFilters({
      brands: filters.brands.includes(brand)
        ? filters.brands.filter((b) => b !== brand)
        : [...filters.brands, brand],
    });
  };

  const setPrice = (min, max) => {
    updateFilters({
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
      rating: "",
      sort: "featured",
      discount: "",
      inStock: "",
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

        {visibleCategories.map((cat) => (
          <label
            key={cat.name}
            className="filter-item"
          >
            <input
              type="radio"
              name="category"
              checked={filters.category === cat.name}
              onChange={() =>
                updateFilters({
                  category: cat.name,
                })
              }
            />

            <span>{cat.name}</span>
          </label>
        ))}

        {categories.length > 10 && (
          <button
            className="clear-btn"
            onClick={() =>
              setShowAllCategories((prev) => !prev)
            }
          >
            {showAllCategories
              ? "Show Less"
              : `Show More (${categories.length - 10})`}
          </button>
        )}
      </div>

      {/* BRAND */}

      <div className="filter-section">
        <h3>Brand</h3>

        {visibleBrands.map((brand) => (
          <label
            key={brand.name}
            className="filter-item"
          >
            <input
              type="checkbox"
              checked={filters.brands.includes(brand.name)}
              onChange={() =>
                toggleBrand(brand.name)
              }
            />

            <span>{brand.name}</span>
          </label>
        ))}

        {brands.length > 10 && (
          <button
            className="clear-btn"
            onClick={() =>
              setShowAllBrands((prev) => !prev)
            }
          >
            {showAllBrands
              ? "Show Less"
              : `Show More (${brands.length - 10})`}
          </button>
        )}
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

      {/* CUSTOMER RATING */}

      <div className="filter-section">
        <h3>Customer Rating</h3>

        <label className="filter-item">
          <input
            type="radio"
            name="rating"
            checked={filters.rating === "4"}
            onChange={() =>
              updateFilters({
                rating: "4",
              })
            }
          />

          <span>4★ & above</span>
        </label>

        <label className="filter-item">
          <input
            type="radio"
            name="rating"
            checked={filters.rating === "3"}
            onChange={() =>
              updateFilters({
                rating: "3",
              })
            }
          />

          <span>3★ & above</span>
        </label>

        <button
          className="clear-btn"
          onClick={() =>
            updateFilters({
              rating: "",
            })
          }
        >
          Clear Rating
        </button>
      </div>

      {/* DISCOUNT */}

      <div className="filter-section">
        <h3>Discount</h3>

        <label className="filter-item">
          <input
            type="radio"
            name="discount"
            checked={filters.discount === "10"}
            onChange={() =>
              updateFilters({
                discount: "10",
              })
            }
          />

          <span>10% Off or more</span>
        </label>

        <label className="filter-item">
          <input
            type="radio"
            name="discount"
            checked={filters.discount === "25"}
            onChange={() =>
              updateFilters({
                discount: "25",
              })
            }
          />

          <span>25% Off or more</span>
        </label>

        <label className="filter-item">
          <input
            type="radio"
            name="discount"
            checked={filters.discount === "50"}
            onChange={() =>
              updateFilters({
                discount: "50",
              })
            }
          />

          <span>50% Off or more</span>
        </label>

        <button
          className="clear-btn"
          onClick={() =>
            updateFilters({
              discount: "",
            })
          }
        >
          Clear Discount
        </button>
      </div>

      {/* AVAILABILITY */}

      <div className="filter-section">
        <h3>Availability</h3>

        <label className="filter-item">
          <input
            type="checkbox"
            checked={filters.inStock === "true"}
            onChange={(e) =>
              updateFilters({
                inStock: e.target.checked
                  ? "true"
                  : "",
              })
            }
          />

          <span>In Stock</span>
        </label>

        <label className="filter-item">
          <input
            type="checkbox"
            checked={filters.inStock === "false"}
            onChange={(e) =>
              updateFilters({
                inStock: e.target.checked
                  ? "false"
                  : "",
              })
            }
          />

          <span>Out of Stock</span>
        </label>
      </div>
    </aside>
  );
}

export default FilterSidebar;