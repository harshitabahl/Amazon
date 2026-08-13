import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cartContext";

const OrderSummary = () => {
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const userId = currentUser?._id || currentUser?.id;

  if (!cart || cart.items.length === 0) {
    return null;
  }

  const subtotal = cart.items.reduce(
    (sum, item) =>
      sum + item.productId.price * item.quantity,
    0
  );

  const totalItems = cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const shipping = 40;
  const total = subtotal + shipping;

  const placeOrder = async () => {
    if (!userId) {
      alert("Please login before placing your order.");
      navigate("/login");
      return;
    }

    try {
      // 1. Create order
      console.log("1. Creating order...");

      const orderResponse = await axios.post(
        "https://amazon-7t4h.onrender.com/api/orders",
        {
          userId,
        }
      );

      console.log("✅ Order created:", orderResponse.data);

      // 2. Clear cart
      console.log("2. Clearing cart...");

      const clearResponse = await axios.delete(
        `https://amazon-7t4h.onrender.com/api/cart/clear/${userId}`
      );

      console.log("✅ Cart cleared:", clearResponse.data);

      // 3. Refresh cart context
      console.log("3. Refreshing cart...");

      await fetchCart();

      console.log("✅ Cart refreshed");

      // 4. Go to success page
      navigate("/order-success", {
        state: {
          order: orderResponse.data,
        },
      });
    } catch (err) {
      console.error("❌ Order error:", err);
      console.error("Status:", err.response?.status);
      console.error("Response:", err.response?.data);

      alert(
        err.response?.data?.message ||
          "Failed to place order. Please try again."
      );
    }
  };

  return (
    <div className="checkout-card">
      <h2>Order Summary</h2>

      <div className="summary-row">
        <span>Items ({totalItems})</span>
        <span>₹{subtotal}</span>
      </div>

      <div className="summary-row">
        <span>Shipping</span>
        <span>₹{shipping}</span>
      </div>

      <hr />

      <div className="total-row">
        <strong>Total</strong>
        <strong>₹{total}</strong>
      </div>

      <button
        className="checkout-btn"
        onClick={placeOrder}
      >
        Place Order
      </button>
    </div>
  );
};

export default OrderSummary;