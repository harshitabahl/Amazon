import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { getPlaceholderImage } from "../placeholder/categoryPlaceholder";
import { useCart } from "../context/cartContext";

function ProductCard({ product, isPriority = false }) {
  const navigate = useNavigate();
  const { fetchCart } = useCart();

  const price = Number(product?.price) || 299;

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const userId = currentUser?._id || currentUser?.id;

  const reviews =
    100 +
    (parseInt(product?._id?.slice(-2), 16) % 400 || 0);

  const rating = (4 + (price % 10) / 10).toFixed(1);

  const oldPrice = Math.round(price * 2.7);

  const discount = Math.round(
    ((oldPrice - price) / oldPrice) * 100
  );

  /* ================= IMAGE ================= */

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
      return `https://amazon-7t4h.onrender.com${img}`;
    }

    return getPlaceholderImage(title);
  };

  /* ================= ADD TO CART ================= */

  const addToCart = async (e) => {
    e.stopPropagation();

    if (!currentUser || !userId) {
      alert("Please sign in to add items to your cart.");
      navigate("/login");
      return;
    }

    try {
      const res = await axios.post(
        "https://amazon-7t4h.onrender.com/api/cart",
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

  /* ================= UI ================= */

  return (
    <div
      className="card"
      onClick={() =>
        navigate(`/product/${product._id}`)
      }
    >
      {/* IMAGE */}

      <div className="image-container">
        <button
          type="button"
          className="wishlist-btn"
          aria-label="Add to Wishlist"
          onClick={(e) => e.stopPropagation()}
        >
          <Heart size={18} />
        </button>

        <img
          className="product-image"
          src={getImage()}
          alt={product?.title || "Product"}
          width={420}
          height={420}
          loading={isPriority ? "eager" : "lazy"}
          fetchPriority={isPriority ? "high" : "auto"}
          decoding="async"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = getPlaceholderImage(
              product?.title || ""
            );
          }}
        />
      </div>

      {/* CONTENT */}

      <div className="card-content">
        <div className="brand">
          {product?.brand || "Amazon Brand"}
        </div>

        <h3
          className="card-title"
          title={product?.title || ""}
        >
          {product?.title || "Product"}
        </h3>

        {/* RATING */}

        <div className="rating">
          <span className="rating-stars">
            {rating} ★
          </span>

          <span className="rating-count">
            ({reviews.toLocaleString()})
          </span>
        </div>

        {/* PRICE */}

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

        {/* DELIVERY */}

        <div className="delivery">
          <strong>FREE Delivery</strong> Tomorrow
        </div>

        {/* PRIME */}

        <div className="prime">
          ✔ Prime
        </div>

        {/* CART */}

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