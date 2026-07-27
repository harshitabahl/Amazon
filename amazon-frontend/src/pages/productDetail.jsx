import { useEffect, useState } from "react";
import axios from "axios";
import "./productDetail.css";
import { useNavigate, useParams } from "react-router-dom";

function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);

  useEffect(() => {
    axios
      .get(`http://https://amazon-7t4h.onrender.com/api/products/${id}`)
      .then((res) => setProduct(res.data))
      .catch((err) => console.log(err));
  }, [id]);

  if (!product) {
    return <h2 className="loading">Loading Product...</h2>;
  }

  const price = Number(product.price) || 299;
  const oldPrice = Math.round(price * 2.7);
  const discount = Math.round(
    ((oldPrice - price) / oldPrice) * 100
  );

  const rating = (4 + (price % 10) / 10).toFixed(1);
  const reviews = 100 + (parseInt(product._id.slice(-2), 16) % 400);

  return (
    <div className="product-wrapper">

      {/* Breadcrumbs */}
      <div
        className="breadcrumbs"
        onClick={() => navigate(-1)}
        style={{
          cursor: "pointer",
          color: "#007185",
          fontWeight: "500",
          marginBottom: "20px",
        }}
      >
        ← Back to Shopping
      </div>

      <div className="product-page">

        {/* LEFT */}
        <div className="image-section">

          <img
            className="main-image"
            src={
              product.img?.startsWith("http")
                ? product.img
                : "/placeholder.png"
            }
            alt={product.title}
            onError={(e) => {
              e.currentTarget.onerror = null;
              e.currentTarget.src = "/placeholder.png";
            }}
          />

        </div>

        {/* CENTER */}

        <div className="details-section">

          <h1>{product.title}</h1>

         
         <p className="brand">
                Brand{" "}
                <span>
                  {product.brand?.trim() ? product.brand : "Verified Seller"}
                </span>
              </p>

          <div className="rating">
            ⭐⭐⭐⭐☆ {rating}
            <span> ({reviews} ratings)</span>
          </div>

          <hr />

          <div className="price-row">

            <span className="price">
              ₹{price}
            </span>

            <span className="old-price">
              ₹{oldPrice}
            </span>

            <span className="discount">
              {discount}% off
            </span>

          </div>

          <p className="delivery">
            FREE Delivery <strong>Tomorrow</strong>
          </p>

          <p className="stock">
            In Stock
          </p>

          <p className="ships">
            Ships from <strong>Amazon Clone</strong>
          </p>

          <p className="ships">
            Sold by <strong>Verified Seller</strong>
          </p>

          <hr />

          <h3>About this item</h3>

          <ul className="features">
          <li>{product.desc || "Premium quality product."}</li>
          <li>High quality material</li>
          <li>Best value for money</li>
          <li>Fast delivery available</li>
          <li>Easy returns & secure checkout</li>
        </ul>

          <p className="category">
            <strong>Category :</strong>{" "}
            {product.categories?.join(", ")}
          </p>

          <p className="sku">
            Product ID : {product._id}
          </p>

        </div>

        {/* RIGHT */}

        <div className="buy-box">

          <h2>₹{price}</h2>

          <p className="delivery">
            FREE Delivery <strong>Tomorrow</strong>
          </p>

          <p className="stock">
            In Stock
          </p>

          <label>Quantity</label>

          <select className="qty">
            <option>1</option>
            <option>2</option>
            <option>3</option>
            <option>4</option>
            <option>5</option>
          </select>

          <button className="cart-btn">
            Add to Cart
          </button>

          <button className="buy-btn">
            ⚡ Buy Now
          </button>

          <p className="secure">
            ✔ Secure Transaction
          </p>

          <p className="returns">
            Eligible for FREE Returns
          </p>

        </div>

      </div>

    </div>
  );
}

export default ProductDetail;