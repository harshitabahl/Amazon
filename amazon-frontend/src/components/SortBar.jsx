function SortBar({ total, search, filters, setFilters }) {
  const handleSortChange = (e) => {
    setFilters((prev) => ({
      ...prev,
      sort: e.target.value,
    }));
  };

  return (
    <div className="products-top">
      <div className="products-top-left">
        <p className="breadcrumb">
          Home {search && <> &gt; Search results for "{search}"</>}
        </p>

        <h1 className="results-title">
          {search ? `Results for "${search}"` : "All Products"}
        </h1>

        <p className="results-count">
          Showing {total} {total === 1 ? "result" : "results"}
        </p>
      </div>

      <div className="sort-container">
        <label htmlFor="sort">Sort by:</label>

        <select
          id="sort"
          value={filters.sort}
          onChange={handleSortChange}
        >
          <option value="featured">Featured</option>
          <option value="bestSelling">Best Sellers</option>
          <option value="newest">Newest Arrivals</option>
          <option value="priceLow">Price: Low to High</option>
          <option value="priceHigh">Price: High to Low</option>
          <option value="title">Name (A - Z)</option>
        </select>
      </div>
    </div>
  );
}

export default SortBar;