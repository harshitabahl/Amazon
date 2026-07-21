import { useState } from "react";

const PaymentSection = () => {
  const [paymentMethod, setPaymentMethod] = useState("COD");

  return (
    <div className="checkout-card">
      <h2>Payment Method</h2>

      <div className="payment-option">
        <label>
          <input
            type="radio"
            name="payment"
            value="COD"
            checked={paymentMethod === "COD"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />

          <span className="payment-title">
            Cash on Delivery
          </span>
        </label>
      </div>
      <hr />
    </div>
  );
};

export default PaymentSection;