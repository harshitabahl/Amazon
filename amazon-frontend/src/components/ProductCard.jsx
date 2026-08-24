import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { getPlaceholderImage } from "../placeholder/categoryPlaceholder";
import { useCart } from "../context/cartContext";

function ProductCard({ product, priority = false }) {
  const navigate = useNavigate();
  const { fetchCart } = useCart();

  const price = Number(product?.price) || 299;

  /* ================= USER ================= */

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const userId =
    currentUser?._id || currentUser?.id;

  /* ================= PRODUCT DATA ================= */

  const productId = product?._id;

  const reviews =
    100 +
    (parseInt(productId?.slice(-2), 16) % 400 || 0);

  const rating = (
    4 +
    (price % 10) / 10
  ).toFixed(1);

  const oldPrice = Math.round(
    price * 2.7
  );

  const discount = Math.round(
    ((oldPrice - price) / oldPrice) * 100
  );

  /* ================= IMAGE ================= */

  const productImage =
    typeof product?.img === "string" &&
    product.img.trim()
      ? product.img.startsWith("http")
        ? product.img
        : product.img.startsWith("/uploads")
        ? `https://amazon-7t4h.onrender.com${product.img}`
        : getPlaceholderImage(
            product?.title || ""
          )
      : getPlaceholderImage(
          product?.title || ""
        );

  /* ================= ADD TO CART ================= */

  const addToCart = async (e) => {
    e.stopPropagation();

    if (!currentUser || !userId) {
      alert(
        "Please sign in to add items to your cart."
      );

      navigate("/login");

      return;
    }

    try {
      const res = await axios.post(
        "https://amazon-7t4h.onrender.com/api/cart",
        {
          userId,
          productId,
        }
      );

      await fetchCart();

      console.log(
        "Added to cart:",
        res.data
      );
    } catch (err) {
      console.error(
        "Add to cart error:",
        err
      );

      alert(
        "Failed to add to cart"
      );
    }
  };

  /* ================= PRODUCT CLICK ================= */

  const openProduct = () => {
    navigate(`/product/${productId}`);
  };

  /* ================= UI ================= */

  return (
    <article
      className="card"
      onClick={openProduct}
      style={{
        contentVisibility: "auto",
        containIntrinsicSize: "420px",
      }}
    >
      <div
        className="image-container"
        style={{
          position: "relative",
          aspectRatio: "1 / 1",
          contain: "layout paint",
        }}
      >
        <button
          type="button"
          className="wishlist-btn"
          aria-label="Add to Wishlist"
          onClick={(e) =>
            e.stopPropagation()
          }
        >
          <Heart size={16} />
        </button>

        <img
          className="product-image"
          src={productImage}
          alt={
            product?.title || "Product"
          }
          width="220"
          height="220"
          loading={
            priority
              ? "eager"
              : "lazy"
          }
          fetchPriority={
            priority
              ? "high"
              : "auto"
          }
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
        <div className="brand">
          {product?.brand ||
            "Amazon Brand"}
        </div>

        <h3
          className="card-title"
          title={product?.title}
        >
          {product?.title}
        </h3>

        <div className="rating">
          <span className="rating-stars">
            {rating} ★
          </span>

          <span className="rating-count">
            ({reviews.toLocaleString()})
          </span>
        </div>

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

        <div className="delivery">
          <strong>
            FREE Delivery
          </strong>{" "}
          Tomorrow
        </div>

        <div className="prime">
          ✔ Prime
        </div>

        <button
          type="button"
          className="add-cart-btn"
          onClick={addToCart}
        >
          Add to Cart
        </button>
      </div>
    </article>
  );
}

export default ProductCard;