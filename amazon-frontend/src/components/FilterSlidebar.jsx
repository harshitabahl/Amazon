function FilterSidebar({
  filterData,
  filters,
  setFilters,
}) {
  const brands = filterData.brands || [];
  const categories = filterData.categories || [];

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
            rating: "",
            sort: "featured",
            discount: "",
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
          <label
            key={cat.name}
            className="filter-item"
          >
            <input
              type="radio"
              name="category"
              checked={filters.category === cat.name}
              onChange={() =>
                setFilters({
                  ...filters,
                  category: cat.name,
                })
              }
            />

            <span>
              {cat.name}
            </span>
          </label>
        ))}
      </div>

      {/* BRAND */}

      <div className="filter-section">
        <h3>Brand</h3>

        {brands.map((brand) => (
          <label
            key={brand.name}
            className="filter-item"
          >
            <input
              type="checkbox"
              checked={filters.brands.includes(brand.name)}
              onChange={() => toggleBrand(brand.name)}
            />

            <span>
              {brand.name}
            </span>
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


      {/* CUSTOMER RATING */}

            <div className="filter-section">
            <h3>Customer Rating</h3>

            <label className="filter-item">
                <input
                type="radio"
                name="rating"
                checked={filters.rating === "4"}
                onChange={() =>
                    setFilters({
                    ...filters,
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
                    setFilters({
                    ...filters,
                    rating: "3",
                    })
                }
                />
                <span>3★ & above</span>
            </label>

            <button
                className="clear-btn"
                onClick={() =>
                setFilters({
                    ...filters,
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
                setFilters({
                ...filters,
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
                setFilters({
                ...filters,
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
                setFilters({
                ...filters,
                discount: "50",
                })
            }
            />
            <span>50% Off or more</span>
        </label>

        <button
            className="clear-btn"
            onClick={() =>
            setFilters({
                ...filters,
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
                setFilters({
                ...filters,
                inStock: e.target.checked ? "true" : "",
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
                setFilters({
                ...filters,
                inStock: e.target.checked ? "false" : "",
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