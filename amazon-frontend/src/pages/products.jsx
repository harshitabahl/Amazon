import { useEffect, useState } from "react";
import axios from "axios";
import "./products.css";
import ProductCard from "../components/ProductCard";

function Products() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);

  const [search, setSearch] = useState("");

  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5001/api/products?page=${page}&limit=20`
      );

      setProducts(res.data.products);
      setFiltered(res.data.products);
      setPages(res.data.pages);
    } catch (err) {
      console.log(err);
    }
  };

  const handleSearch = (text) => {
    setSearch(text);

    const data = products.filter((p) =>
      p.title.toLowerCase().includes(text.toLowerCase())
    );

    setFiltered(data);
  };

  return (
    <div className="container">

      <div className="header">
        <h2>All Products</h2>

        <input
          type="text"
          placeholder="Search..."
          value={search}
          onChange={(e) => handleSearch(e.target.value)}
        />
      </div>

      <div className="grid">
        {filtered.map((product) => (
          <ProductCard
            key={product._id}
            product={product}
          />
        ))}
      </div>
      {/* PAGINATION */}
        <div className="pagination">
            <button
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
            >
                Previous
            </button>

            <span>
                Page {page} of {pages}
            </span>

            <button
                disabled={page === pages}
                onClick={() => setPage(page + 1)}
            >
                Next
            </button>
            </div>
    </div>
  );
}

export default Products;