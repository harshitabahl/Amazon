import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { useEffect, useState } from "react";
import { getPlaceholderImage } from "../placeholder/categoryPlaceholder";
import { useCart } from "../context/cartContext";

const API_URL = "https://amazon-7t4h.onrender.com";

function ProductCard({ product }) {
  const navigate = useNavigate();
  const { fetchCart } = useCart();

  const [isWishlisted, setIsWishlisted] = useState(false);

  const price = Number(product?.price) || 299;

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const userId = currentUser?._id || currentUser?.id;

  // ================= CHECK WISHLIST =================

  useEffect(() => {
    const checkWishlist = async () => {
      if (!userId || !product?._id) {
        return;
      }

      try {
        const res = await axios.get(
          `${API_URL}/api/wishlist/${userId}`
        );

        const wishlistProducts = res.data.products || [];

        const exists = wishlistProducts.some(
          (item) => item._id === product._id
        );

        setIsWishlisted(exists);
      } catch (err) {
        console.error(
          "Failed to check wishlist:",
          err
        );
      }
    };

    checkWishlist();
  }, [userId, product?._id]);

  // ================= TOGGLE WISHLIST =================

  const toggleWishlist = async (e) => {
    e.stopPropagation();

    if (!currentUser || !userId) {
      alert("Please sign in to use Wishlist.");
      navigate("/login");
      return;
    }

    try {
      if (!isWishlisted) {
        await axios.post(
          `${API_URL}/api/wishlist/${userId}/${product._id}`
        );

        setIsWishlisted(true);
      } else {
        await axios.delete(
          `${API_URL}/api/wishlist/${userId}/${product._id}`
        );

        setIsWishlisted(false);
      }
    } catch (err) {
      console.error("Wishlist error:", err);

      alert(
        err.response?.data?.message ||
          "Failed to update wishlist"
      );
    }
  };

  // ================= PRODUCT DETAILS =================

  const reviews =
    100 +
    (parseInt(product?._id?.slice(-2), 16) % 400 || 0);

  const rating = (4 + (price % 10) / 10).toFixed(1);

  const oldPrice = Math.round(price * 2.7);

  const discount = Math.round(
    ((oldPrice - price) / oldPrice) * 100
  );

  // ================= IMAGE =================

  const getImage = () => {
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

  // ================= CART =================

  const addToCart = async (e) => {
    e.stopPropagation();

    if (!currentUser || !userId) {
      alert("Please sign in to add items to your cart.");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(
        `${API_URL}/api/cart`,
        {
          userId,
          productId: product._id,
        }
      );

      await fetchCart();

      console.log("Added to cart:", res.data);
    } catch (err) {
      console.error("Add to cart error:", err);

      alert("Failed to add to cart");
    }
  };

  // ================= UI =================

  return (
    <div
      className="card"
      onClick={() =>
        navigate(`/product/${product._id}`)
      }
    >
      <div className="image-container">

        {/* Wishlist */}
        <button
          type="button"
          className="wishlist-btn"
          aria-label={
            isWishlisted
              ? "Remove from Wishlist"
              : "Add to Wishlist"
          }
          onClick={toggleWishlist}
        >
          <Heart
            size={18}
            fill={
              isWishlisted
                ? "red"
                : "none"
            }
            color={
              isWishlisted
                ? "red"
                : "currentColor"
            }
          />
        </button>

        {/* Product Image */}
        <img
          className="product-image"
          src={getImage()}
          alt={product?.title || "Product"}
          width="420"
          height="420"
          loading="lazy"
          fetchPriority="low"
          decoding="async"
          onError={(e) => {
            e.currentTarget.onerror = null;

            e.currentTarget.src =
              getPlaceholderImage(
                product?.title || ""
              );
          }}
        />
      </div>

      <div className="card-content">

        {/* Brand */}
        <div className="brand">
          {product?.brand || "Amazon Brand"}
        </div>

        {/* Title */}
        <h3
          className="card-title"
          title={product?.title}
        >
          {product?.title}
        </h3>

        {/* Rating */}
        <div className="rating">
          <span className="rating-stars">
            {rating} ★
          </span>

          <span className="rating-count">
            ({reviews.toLocaleString()})
          </span>
        </div>

        {/* Price */}
        <div className="price-row">
          <span className="price">
            ₹{price}
          </span>

          <span className="old-price">
            ₹{oldPrice}
          </span>

          <span className="discount-text">
            {discount}% off
          </span>
        </div>

        {/* Delivery */}
        <div className="delivery">
          <strong>FREE Delivery</strong>{" "}
          Tomorrow
        </div>

        {/* Prime */}
        <div className="prime">
          ✔ Prime
        </div>

        {/* Cart */}
        <button
          type="button"
          className="add-cart-btn"
          onClick={addToCart}
        >
          Add to Cart
        </button>

      </div>
    </div>
  );
}

export default ProductCard;