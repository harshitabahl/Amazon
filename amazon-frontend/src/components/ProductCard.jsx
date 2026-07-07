import { useNavigate } from "react-router-dom";
import { Heart } from "lucide-react";
import { getPlaceholderImage } from "../placeholder/categoryPlaceholder";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const price = Number(product?.price) || 299;

  const reviews =
    100 + (parseInt(product?._id?.slice(-2), 16) % 400 || 0);

  const rating = (4 + (price % 10) / 10).toFixed(1);

  const oldPrice = Math.round(price * 2.7);

  const discount = Math.round(
    ((oldPrice - price) / oldPrice) * 100
  );

  const getImage = () => {
    const img = product?.img;
    const title = product?.title || "";

    if (typeof img === "string" && img.startsWith("http")) {
      return img;
    }

    if (typeof img === "string" && img.startsWith("/uploads")) {
      return `http://localhost:5001${img}`;
    }

    return getPlaceholderImage(title);
  };

  return (
    <div
      className="card"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      {/* Product Image */}

      <div className="image-container">

        <button
          className="wishlist-btn"
          aria-label="Add to Wishlist"
          onClick={(e) => e.stopPropagation()}
        >
          <Heart size={18} />
        </button>

        <img
          className="product-image"
          src={getImage()}
          alt={product?.title}
          loading="lazy"
          onError={(e) => {
            e.currentTarget.onerror = null;
            e.currentTarget.src = getPlaceholderImage(
              product?.title || ""
            );
          }}
        />
      </div>

      {/* Product Details */}

      <div className="card-content">

        <div className="brand">
          {product.brand || "Amazon Brand"}
        </div>

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
          <strong>FREE Delivery</strong> Tomorrow
        </div>

        <div className="prime">
          ✔ Prime
        </div>

        {/* Button */}

        <button
          className="add-cart-btn"
          onClick={(e) => {
            e.stopPropagation();
            console.log(product);
          }}
        >
          Add to Cart
        </button>

      </div>
    </div>
  );
}

export default ProductCard;