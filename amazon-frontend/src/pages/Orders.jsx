import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import "../styles/orders.css";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const userId = currentUser?._id || currentUser?.id;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `https://amazon-7t4h.onrender.com/api/orders/${userId}`
        );

        setOrders(res.data || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  // ================= LOGIN CHECK =================

  if (!currentUser) {
    return (
      <div className="orders-center-page">
        <div className="orders-message-card">

          <div className="orders-message-icon">
            📦
          </div>

          <h2>
            Please login to view your orders
          </h2>

          <p>
            Sign in to check your previous orders and delivery details.
          </p>

          <Link
            to="/login"
            className="orders-primary-btn"
          >
            Login
          </Link>

        </div>
      </div>
    );
  }

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="orders-center-page">

        <div className="orders-loading">

          <div className="orders-spinner" />

          <p>
            Loading orders...
          </p>

        </div>

      </div>
    );
  }

  // ================= PAGE =================

  return (
    <div className="orders-page">

      <div className="orders-container">

        {/* HEADER */}

        <div className="orders-header">

          <h1>
            Your Orders
          </h1>

          <p>
            Track, view and manage your previous purchases
          </p>

        </div>

        {/* EMPTY */}

        {orders.length === 0 ? (
          <div className="orders-empty">

            <div className="orders-empty-icon">
              📦
            </div>

            <h2>
              You haven't placed any orders yet
            </h2>

            <p>
              Your orders will appear here after you place an order.
            </p>

            <Link
              to="/products"
              className="orders-primary-btn"
            >
              Start Shopping
            </Link>

          </div>
        ) : (

          <div className="orders-list">

            {orders.map((order) => (
              <div
                key={order._id}
                className="order-card"
              >

                {/* ================= ORDER HEADER ================= */}

                <div className="order-card-header">

                  <div className="order-meta">

                    <div className="order-meta-item">

                      <span>
                        Order placed
                      </span>

                      <strong>
                        {new Date(
                          order.createdAt
                        ).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })}
                      </strong>

                    </div>

                    <div className="order-meta-item">

                      <span>
                        Total
                      </span>

                      <strong>
                        ₹{order.amount}
                      </strong>

                    </div>

                    <div className="order-meta-item">

                      <span>
                        Order ID
                      </span>

                      <strong className="order-id">
                        {order._id}
                      </strong>

                    </div>

                  </div>

                  <div className="order-status">
                    {order.status}
                  </div>

                </div>

                {/* ================= PRODUCTS ================= */}

                <div className="order-products">

                  {order.products.map((product, index) => (
                    <div
                      key={
                        product._id ||
                        product.productId ||
                        index
                      }
                      className="order-product"
                    >

                      <div className="order-product-image-wrapper">

                        <img
                          src={product.image}
                          alt={product.title}
                          className="order-product-image"
                          onError={(e) => {
                            e.currentTarget.style.display =
                              "none";
                          }}
                        />

                      </div>

                      <div className="order-product-info">

                        <h3>
                          {product.title}
                        </h3>

                        <p className="order-product-price">
                          ₹{product.price}
                        </p>

                        <p>
                          Quantity: {product.quantity}
                        </p>

                      </div>

                    </div>
                  ))}

                </div>

                {/* ================= FOOTER ================= */}

                <div className="order-footer">

                  {order.address && (
                    <div className="order-delivery-summary">

                      <span className="order-footer-label">
                        Deliver to
                      </span>

                      <div className="order-delivery-main">

                        <strong>
                          {order.address.fullName}
                        </strong>

                        <span>
                          {order.address.city},{" "}
                          {order.address.state}{" "}
                          {order.address.pincode}
                        </span>

                      </div>

                    </div>
                  )}

                  <div className="order-footer-right">

                    <div className="order-payment-chip">
                      {order.paymentMethod || "COD"}
                    </div>

                  </div>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>

    </div>
  );
};

export default Orders;