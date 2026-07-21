import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./cart.css";
import { useCart } from "../context/cartContext";

function Cart() {
  const { cart, fetchCart } = useCart();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate(); 

  useEffect(() => {
    const loadCart = async () => {
      try {
        await fetchCart();
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, [fetchCart]);

  const increaseQuantity = async (productId) => {
    try {
      await axios.patch(
        "http://localhost:5001/api/cart/increase",
        {
          userId: "demo-user",
          productId,
        }
      );

      await fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const decreaseQuantity = async (productId) => {
    try {
      await axios.patch(
        "http://localhost:5001/api/cart/decrease",
        {
          userId: "demo-user",
          productId,
        }
      );

      await fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  const removeItem = async (productId) => {
    try {
      await axios.delete(
        "http://localhost:5001/api/cart/remove",
        {
          data: {
            userId: "demo-user",
            productId,
          },
        }
      );

      await fetchCart();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <h2>Loading Cart...</h2>;

  if (!cart || cart.items.length === 0) {
    return <h2>Your Cart is Empty 🛒</h2>;
  }

  const subtotal = cart.items.reduce(
    (total, item) => total + item.productId.price * item.quantity,
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

        <button className="checkout-btn" onClick={() => navigate("/checkout")}>
            Proceed to Checkout
        </button>
      </div>
    </div>
  );
}

export default Cart;