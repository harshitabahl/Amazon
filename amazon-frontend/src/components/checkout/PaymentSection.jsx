const PaymentSection = ({
  paymentMethod,
  setPaymentMethod,
}) => {
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

      <div className="payment-option">
        <label>
          <input
            type="radio"
            name="payment"
            value="RAZORPAY"
            checked={paymentMethod === "RAZORPAY"}
            onChange={(e) => setPaymentMethod(e.target.value)}
          />

          <span className="payment-title">
            Pay Online
          </span>
        </label>

        <p className="payment-description">
          Pay securely using UPI, card, net banking or wallet.
        </p>
      </div>
    </div>
  );
};

export default PaymentSection;