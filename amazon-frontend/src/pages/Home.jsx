import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Slider from "../components/Slider";
import ProductCard from "../components/ProductCard";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5001/api/products"
        );

        // Show only 5 featured products
        setProducts((res.data.products || []).slice(0, 5));

      } catch (err) {
        console.log(err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div>
      <Navbar />
      <Slider />

      <div
        style={{
        padding: "40px 30px",
        marginTop: "30px",
        background: "#eaeded",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2>Featured Products</h2>

          <button
            onClick={() => navigate("/products")}
            style={{
              background: "transparent",
              border: "none",
              color: "#007185",
              cursor: "pointer",
              fontSize: "16px",
              fontWeight: "bold",
            }}
          >
            View All →
          </button>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5, 1fr)",
            gap: "20px",
          }}
        >
          {products.map((product) => (
            <ProductCard
              key={product._id}
              product={product}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;