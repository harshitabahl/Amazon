import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useCart } from "../../context/cartContext";

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
      return;
    }

    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;

    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);

    document.body.appendChild(script);
  });
};

const OrderSummary = ({ paymentMethod }) => {
  const { cart, fetchCart } = useCart();
  const navigate = useNavigate();

  const [processing, setProcessing] = useState(false);

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

  const completeOrder = async (order) => {
    await fetchCart();

    navigate("/order-success", {
      state: { order },
    });
  };

  const placeCODOrder = async () => {
    const response = await axios.post(
      `${API_URL}/api/orders`,
      { userId }
    );

    await completeOrder(response.data);
  };

  const payWithRazorpay = async () => {
    const scriptLoaded = await loadRazorpayScript();

    if (!scriptLoaded) {
      throw new Error(
        "Razorpay Checkout could not load. Check your internet connection."
      );
    }

    const createResponse = await axios.post(
      `${API_URL}/api/orders/razorpay/create`,
      { userId }
    );

    const {
      key,
      amount,
      currency,
      razorpayOrderId,
    } = createResponse.data;

    const options = {
      key,
      amount,
      currency,
      name: "Amazon Clone",
      description: `Payment for ${totalItems} item(s)`,
      order_id: razorpayOrderId,

      handler: async (paymentResponse) => {
        try {
          const verifyResponse = await axios.post(
            `${API_URL}/api/orders/razorpay/verify`,
            {
              razorpay_order_id:
                paymentResponse.razorpay_order_id,
              razorpay_payment_id:
                paymentResponse.razorpay_payment_id,
              razorpay_signature:
                paymentResponse.razorpay_signature,
            }
          );

          await completeOrder(verifyResponse.data.order);
        } catch (err) {
          console.error("Payment verification error:", err);

          alert(
            err.response?.data?.message ||
              "Payment verification failed. Please contact support."
          );
        } finally {
          setProcessing(false);
        }
      },

      prefill: {
        name: currentUser?.name || "",
        email: currentUser?.email || "",
      },

      theme: {
        color: "#ff9900",
      },

      modal: {
        ondismiss: () => {
          setProcessing(false);
        },
      },
    };

    const razorpayCheckout = new window.Razorpay(options);

    razorpayCheckout.on("payment.failed", (response) => {
      console.error(
        "Razorpay payment failed:",
        response.error
      );

      alert(
        response.error?.description ||
          "Payment failed. Please try again."
      );

      setProcessing(false);
    });

    razorpayCheckout.open();
  };

  const handleOrder = async () => {
    if (!userId) {
      alert("Please log in before placing your order.");
      navigate("/login");
      return;
    }

    try {
      setProcessing(true);

      if (paymentMethod === "RAZORPAY") {
        await payWithRazorpay();
      } else {
        await placeCODOrder();
        setProcessing(false);
      }
    } catch (err) {
      console.error("Order error:", err);

      alert(
        err.response?.data?.message ||
          err.message ||
          "Failed to place order. Please try again."
      );

      setProcessing(false);
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
        onClick={handleOrder}
        disabled={processing}
      >
        {processing
          ? "Processing..."
          : paymentMethod === "RAZORPAY"
            ? `Pay ₹${total}`
            : "Place Order"}
      </button>
    </div>
  );
};

export default OrderSummary;