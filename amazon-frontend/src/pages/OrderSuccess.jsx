import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./orderSuccess.css";

const OrderSuccess = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const order = state?.order;

  useEffect(() => {
    if (!order) {
      navigate("/", { replace: true });
    }
  }, [order, navigate]);

  if (!order) return null;

  return (
    <div className="success-page">
      <div className="success-card">

        {/* SUCCESS ICON */}
        <div className="success-icon">✓</div>

        <h1>Order Placed Successfully!</h1>

        <p className="success-message">
          Thank you for your order. Your order has been placed successfully.
        </p>

        {/* ORDER ID */}
        <div className="order-id">
          Order ID: <strong>#{order._id}</strong>
        </div>

        {/* ORDER DETAILS */}
        <div className="order-details">

          <div className="detail-box">
            <span className="detail-label">Payment</span>
            <strong>{order.paymentMethod}</strong>
          </div>

          <div className="detail-box">
            <span className="detail-label">Items</span>
            <strong>{order.products?.length || 0}</strong>
          </div>

          <div className="detail-box">
            <span className="detail-label">Total</span>
            <strong>₹{order.amount}</strong>
          </div>

          <div className="detail-box">
            <span className="detail-label">Status</span>
            <strong className="status">
              {order.status}
            </strong>
          </div>

        </div>

        {/* BUTTONS */}
        <div className="success-buttons">

          <button
            className="continue-btn"
            onClick={() => navigate("/")}
          >
            Continue Shopping
          </button>

          <button
            className="orders-btn"
            onClick={() => navigate("/orders")}
          >
            View Orders
          </button>

        </div>

      </div>
    </div>
  );
};

export default OrderSuccess;