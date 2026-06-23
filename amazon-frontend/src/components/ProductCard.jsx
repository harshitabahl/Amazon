import { useNavigate } from "react-router-dom";
import { getPlaceholderImage } from "../placeholder/categoryPlaceholder";

function ProductCard({ product }) {
  const navigate = useNavigate();

  const price = Number(product.price) || 299;
  const reviews =
    100 + (parseInt(product._id?.slice(-2), 16) % 400 || 0);
  const rating = (4 + (price % 10) / 10).toFixed(1);
  const oldPrice = Math.round(price * 2.7);
  const discount = Math.round(((oldPrice - price) / oldPrice) * 100);

  // ✅ FINAL IMAGE LOGIC
  const getImage = () => {
    const img = product?.img;
    const title = product?.title || "";

    if (typeof img === "string" && img.startsWith("http")) return img;

    if (typeof img === "string" && img.startsWith("/uploads"))
      return `http://localhost:5001${img}`;

    return getPlaceholderImage(title);
  };

  return (
    <div
      className="card"
      onClick={() => navigate(`/product/${product._id}`)}
      style={{ cursor: "pointer" }}
    >
      <img
        className="product-image"
        src={getImage()}
        alt={product?.title}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.onerror = null;
          e.currentTarget.src = getPlaceholderImage(product?.title || "");
        }}
      />

      <h4>
        {product?.title?.length > 55
          ? product.title.substring(0, 55) + "..."
          : product?.title}
      </h4>

      <div className="rating">
        ⭐⭐⭐⭐☆
        <span> {rating}</span>
        <span> ({reviews})</span>
      </div>

      <div className="price-row">
        <span className="price">₹{price}</span>
        <span className="old-price">₹{oldPrice}</span>
        <span className="discount">{discount}% off</span>
      </div>

      <p className="delivery">
        FREE Delivery <strong>Tomorrow</strong>
      </p>

      <button
        onClick={(e) => e.stopPropagation()}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;