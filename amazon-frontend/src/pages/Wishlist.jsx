import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import { getPlaceholderImage } from "../placeholder/categoryPlaceholder";
import "../styles/wishlist.css";

const API_URL = "https://amazon-7t4h.onrender.com";

const Wishlist = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const userId = currentUser?._id || currentUser?.id;

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        setError("");

        const res = await axios.get(
          `${API_URL}/api/wishlist/${userId}`
        );

        setProducts(
          Array.isArray(res.data?.products)
            ? res.data.products
            : []
        );
      } catch (err) {
        console.error("Failed to fetch wishlist:", err);

        setError("Failed to load wishlist");
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [userId]);

  const removeFromWishlist = async (productId) => {
    if (!userId || !productId) return;

    try {
      await axios.delete(
        `${API_URL}/api/wishlist/${userId}/${productId}`
      );

      setProducts((prev) =>
        prev.filter(
          (product) =>
            String(product._id) !== String(productId)
        )
      );
    } catch (err) {
      console.error("Remove wishlist error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to remove from wishlist"
      );
    }
  };

  const getImage = (product) => {
    const img = product?.img;
    const title = product?.title || "";

    if (
      typeof img === "string" &&
      img.startsWith("http")
    ) {
      return img;
    }

    if (
      typeof img === "string" &&
      img.startsWith("/uploads")
    ) {
      return `${API_URL}${img}`;
    }

    return getPlaceholderImage(title);
  };

  if (!currentUser) {
    return (
      <div className="wishlist-center-page">
        <div className="wishlist-message-card">

          <div className="wishlist-login-icon">
            <Heart size={44} />
          </div>

          <h2>
            Please login to view your wishlist
          </h2>

          <p>
            Sign in to access products you've saved.
          </p>

          <Link
            to="/login"
            className="wishlist-primary-btn"
          >
            Login
          </Link>

        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="wishlist-center-page">
        <div className="wishlist-loading">
          <div className="wishlist-spinner" />
          <p>Loading wishlist...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="wishlist-page">

      <div className="wishlist-container">

        {/* HEADER */}

        <div className="wishlist-header-card">

          <div className="wishlist-header-main">

            <div className="wishlist-header-icon">
              <Heart
                size={27}
                fill="currentColor"
              />
            </div>

            <div>
              <h1>Your Wishlist</h1>

              <p>
                Products you've saved for later
              </p>
            </div>

          </div>

          {products.length > 0 && (
            <div className="wishlist-count">
              {products.length}{" "}
              {products.length === 1
                ? "item"
                : "items"}
            </div>
          )}

        </div>

        {/* ERROR */}

        {error && (
          <div className="wishlist-error-card">

            <p>{error}</p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="wishlist-primary-btn"
            >
              Try Again
            </button>

          </div>
        )}

        {/* EMPTY */}

        {!error && products.length === 0 && (
          <div className="wishlist-empty">

            <div className="wishlist-empty-icon">
              <Heart size={48} />
            </div>

            <h2>
              Your wishlist is empty
            </h2>

            <p>
              Save products you love and they'll appear here.
            </p>

            <Link
              to="/products"
              className="wishlist-primary-btn"
            >
              Start Shopping
            </Link>

          </div>
        )}

        {/* PRODUCTS */}

        {!error && products.length > 0 && (
          <div className="wishlist-grid">

            {products.map((product) => {
              const price =
                Number(product?.price) || 299;

              return (
                <div
                  key={product._id}
                  className="wishlist-card"
                >

                  <div className="wishlist-image-wrap">

                    <img
                      src={getImage(product)}
                      alt={product?.title || "Product"}
                      className="wishlist-image"
                      onClick={() =>
                        navigate(
                          `/product/${product._id}`
                        )
                      }
                      onError={(e) => {
                        e.currentTarget.onerror = null;

                        e.currentTarget.src =
                          getPlaceholderImage(
                            product?.title || ""
                          );
                      }}
                    />

                  </div>

                  <div className="wishlist-card-body">

                    <p className="wishlist-brand">
                      {product?.brand ||
                        "Amazon Brand"}
                    </p>

                    <h2
                      className="wishlist-card-title"
                      onClick={() =>
                        navigate(
                          `/product/${product._id}`
                        )
                      }
                    >
                      {product?.title}
                    </h2>

                    <p className="wishlist-card-price">
                      ₹{price}
                    </p>

                    {product?.inStock === false && (
                      <p className="wishlist-out-stock">
                        Currently unavailable
                      </p>
                    )}

                    <button
                      type="button"
                      onClick={() =>
                        removeFromWishlist(
                          product._id
                        )
                      }
                      className="wishlist-remove-btn"
                    >
                      <Trash2 size={17} />
                      Remove
                    </button>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
};

export default Wishlist;