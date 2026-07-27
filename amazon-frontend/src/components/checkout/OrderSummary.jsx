import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cartContext";

const OrderSummary = () => {
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();

  if (!cart || cart.items.length === 0) return null;

  const subtotal = cart.items.reduce(
    (sum, item) => sum + item.productId.price * item.quantity,
    0
  );

  const totalItems = cart.items.reduce(
    (sum, item) => sum + item.quantity,
    0
  );

  const shipping = 40;
  const total = subtotal + shipping;

  const placeOrder = async () => {
  try {
    console.log("1. Creating order...");

    const res = await axios.post(
      "https://amazon-7t4h.onrender.com/api/orders",
      {
        userId: "demo-user",
      }
    );

    console.log("✅ Order created");

    console.log("2. Clearing cart...");

    const clearRes = await axios.delete(
      "https://amazon-7t4h.onrender.com/api/cart/clear/demo-user"
    );

    console.log("✅ Cart cleared", clearRes.data);

    console.log("3. Fetching cart...");

    await fetchCart();

    console.log("✅ Cart fetched");

    navigate("/order-success", {
      state: {
        order: res.data,
      },
    });
  } catch (err) {
  console.log("FULL ERROR:", err);
  console.log("STATUS:", err.response?.status);
  console.log("DATA:", err.response?.data);

  alert("Failed to place order");
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