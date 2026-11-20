import { useState } from "react";

import AddressSection from "../components/checkout/AddressSection";
import PaymentSection from "../components/checkout/PaymentSection";
import ReviewItems from "../components/checkout/ReviewItems";
import OrderSummary from "../components/checkout/OrderSummary";

import "./checkout.css";

const Checkout = () => {
  const [paymentMethod, setPaymentMethod] = useState("COD");

  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-container">
        <div className="checkout-left">
          <AddressSection />

          <PaymentSection
            paymentMethod={paymentMethod}
            setPaymentMethod={setPaymentMethod}
          />

          <ReviewItems />
        </div>

        <div className="checkout-right">
          <OrderSummary paymentMethod={paymentMethod} />
        </div>
      </div>
    </div>
  );
};

export default Checkout;