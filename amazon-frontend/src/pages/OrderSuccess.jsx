import { useLocation, useNavigate } from "react-router-dom";
import "./orderSuccess.css";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const order = state?.order;

  if (!order) {
    navigate("/");
    return null;
  }

  return (
    <div className="success-page">
      <div className="success-card">
        <div className="success-icon">✅</div>

        <h1>Order Placed Successfully!</h1>

        <div className="order-details">
          <p><strong>Order ID</strong><br />#{order._id}</p>

          <p><strong>Payment</strong><br />{order.paymentMethod}</p>

          <p><strong>Items</strong><br />{order.products.length}</p>

          <p><strong>Total</strong><br />₹{order.amount}</p>

          <p><strong>Status</strong><br />{order.status}</p>
        </div>

        <button
          className="continue-btn"
          onClick={() => navigate("/")}
        >
          Continue Shopping
        </button>
      </div>
    </div>
  );
};

export default OrderSuccess;