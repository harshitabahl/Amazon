import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams } from "react-router-dom";

import "./products.css";

import ProductCard from "../components/ProductCard";
import FilterSidebar from "../components/FilterSlidebar";
import SortBar from "../components/SortBar";
import Pagination from "../components/Pagination";
import SkeletonCard from "../components/SkeletonCard";

function Products() {
  const [searchParams] = useSearchParams();

  const search = searchParams.get("search") || "";

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filterData, setFilterData] = useState({
    categories: [],
    brands: [],
  });

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [filters, setFilters] = useState({
    category: "",
    brands: [],
    minPrice: "",
    maxPrice: "",
    rating: "",
    discount: "",
    inStock: "",
    sort: "featured",
  });

  useEffect(() => {
    setPage(1);
  }, [search]);

  // Reload filter options whenever search/category/price changes
  useEffect(() => {
    fetchFilters();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    search,
    filters.category,
    filters.minPrice,
    filters.maxPrice,
  ]);

  // Reload products whenever filters/page/search changes
  useEffect(() => {
    fetchProducts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, filters, search]);

  async function fetchFilters() {
    try {
      const res = await axios.get(
        "https://amazon-7t4h.onrender.com/api/filters",
        {
          params: {
            page,
            limit: 24,
            search,
            category: filters.category,
            brands: filters.brands.join(","),
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            rating: filters.rating,
            discount: filters.discount,
            inStock: filters.inStock,
            sort: filters.sort,
          }
        }
      );

      setFilterData(
        res.data.filters || {
          categories: [],
          brands: [],
        }
      );
    } catch (err) {
      console.error(err);
    }
  }

  async function fetchProducts() {
    try {
      setLoading(true);

      const res = await axios.get(
        "https://amazon-7t4h.onrender.com/api/products",
        {
          params: {
            page,
            limit: 24,
            search,
            category: filters.category,
            brands: filters.brands.join(","),
            minPrice: filters.minPrice,
            maxPrice: filters.maxPrice,
            rating: filters.rating,
            inStock: filters.inStock,
            sort: filters.sort,
          },
        }
      );

      setProducts(res.data.products || []);
      setPages(res.data.pages || 1);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="products-page">
      <FilterSidebar
        filterData={filterData}
        filters={filters}
        setFilters={setFilters}
      />

      <main className="products-content">
        <SortBar
          total={products.length}
          search={search}
          filters={filters}
          setFilters={setFilters}
        />

        {loading ? (
          <section className="products-grid">
            <div className="grid">
              {Array.from({ length: 12 }).map((_, index) => (
                <SkeletonCard key={index} />
              ))}
            </div>
          </section>
        ) : products.length === 0 ? (
          <div className="empty-state">
            <h2>No matching products found</h2>

            <p>
              Try changing your search or removing some filters.
            </p>

            <button
              className="add-cart-btn"
              style={{
                width: "220px",
                marginTop: "20px",
              }}
              onClick={() =>
                setFilters({
                  category: "",
                  brands: [],
                  minPrice: "",
                  maxPrice: "",
                  rating: "",
                  inStock: "",
                  sort: "featured",
                })
              }
            >
              Clear Filters
            </button>
          </div>
        ) : (
          <section className="products-grid">
            <div className="grid">
              {products.map((product, index) => (
                <ProductCard
                  key={product._id}
                  product={product}
                  isPriority={index < 5}
                />
              ))}
            </div>
          </section>
        )}

        <Pagination
          page={page}
          pages={pages}
          setPage={setPage}
        />
      </main>
    </div>
  );
}

export default Products;