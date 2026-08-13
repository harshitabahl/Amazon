import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./cart.css";
import { useCart } from "../context/cartContext";

function Cart() {
  const { cart, fetchCart } = useCart();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const userId = currentUser?._id || currentUser?.id;

  useEffect(() => {
    const loadCart = async () => {
      try {
        if (userId) {
          await fetchCart();
        }
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [userId, fetchCart]);

  const increaseQuantity = async (productId) => {
    if (!userId) return;

    try {
      await axios.patch(
        "https://amazon-7t4h.onrender.com/api/cart/increase",
        {
          userId,
          productId,
        }
      );

      await fetchCart();
    } catch (err) {
      console.error("Increase quantity error:", err);
    }
  };

  const decreaseQuantity = async (productId) => {
    if (!userId) return;

    try {
      await axios.patch(
        "https://amazon-7t4h.onrender.com/api/cart/decrease",
        {
          userId,
          productId,
        }
      );

      await fetchCart();
    } catch (err) {
      console.error("Decrease quantity error:", err);
    }
  };

  const removeItem = async (productId) => {
    if (!userId) return;

    try {
      await axios.delete(
        "https://amazon-7t4h.onrender.com/api/cart/remove",
        {
          data: {
            userId,
            productId,
          },
        }
      );

      await fetchCart();
    } catch (err) {
      console.error("Remove item error:", err);
    }
  };

  if (loading) {
    return <h2>Loading Cart...</h2>;
  }

  if (!currentUser || !cart || cart.items.length === 0) {
    return <h2>Your Cart is Empty 🛒</h2>;
  }

  const subtotal = cart.items.reduce(
    (total, item) =>
      total + item.productId.price * item.quantity,
    0
  );

  const totalItems = cart.items.reduce(
    (total, item) => total + item.quantity,
    0
  );

  return (
    <div className="cart-page">
      <div className="cart-left">
        <h1>Shopping Cart</h1>

        {cart.items.map((item) => (
          <div className="cart-item" key={item._id}>
            <img
              className="cart-image"
              src={item.productId.img}
              alt={item.productId.title}
            />

            <div className="cart-details">
              <h3 className="cart-title">
                {item.productId.title}
              </h3>

              <div className="stock">In Stock</div>

              <div className="cart-price">
                ₹{item.productId.price}
              </div>

              <div className="quantity-box">
                <button
                  className="qty-btn"
                  onClick={() =>
                    decreaseQuantity(item.productId._id)
                  }
                >
                  -
                </button>

                <span>{item.quantity}</span>

                <button
                  className="qty-btn"
                  onClick={() =>
                    increaseQuantity(item.productId._id)
                  }
                >
                  +
                </button>
              </div>

              <button
                className="remove-btn"
                onClick={() =>
                  removeItem(item.productId._id)
                }
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-right">
        <h2>Order Summary</h2>

        <div className="summary-row">
          <span>Items</span>
          <span>{totalItems}</span>
        </div>

        <div className="summary-row">
          <span>Subtotal</span>
          <span>₹{subtotal}</span>
        </div>

        <div className="summary-row">
          <span>Delivery</span>
          <span>FREE</span>
        </div>

        <hr />

        <div className="total-row">
          <span>Total</span>
          <span>₹{subtotal}</span>
        </div>

        <button
          className="checkout-btn"
          onClick={() => navigate("/checkout")}
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;