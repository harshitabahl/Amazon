import { useNavigate } from "react-router-dom";

function ProductCard({ product }) {
  const navigate = useNavigate();

  // Demo values
  const price = Number(product.price) || 299;
  const reviews = 100 + (parseInt(product._id.slice(-2), 16) % 400);
  const rating = (4 + (price % 10) / 10).toFixed(1);
  const oldPrice = Math.round(price * 2.7);
  const discount = Math.round(((oldPrice - price) / oldPrice) * 100);

  return (
    <div
      className="card"
      onClick={() => navigate(`/product/${product._id}`)}
    >
      <img
        className="product-image"
        src={
          product.img?.startsWith("http")
            ? product.img
            : `http://localhost:5001${product.img}`
        }
        alt={product.title}
        loading="lazy"
        onError={(e) => {
          e.currentTarget.src =
            "https://placehold.co/300x400?text=No+Image";
        }}
      />

      <h4>
        {product.title.length > 55
          ? product.title.substring(0, 55) + "..."
          : product.title}
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
        onClick={(e) => {
          e.stopPropagation();
          // Add to cart logic later
        }}
      >
        Add to Cart
      </button>
    </div>
  );
}

export default ProductCard;