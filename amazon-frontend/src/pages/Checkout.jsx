import AddressSection from "../components/checkout/AddressSection";
import PaymentSection from "../components/checkout/PaymentSection";
import ReviewItems from "../components/checkout/ReviewItems";
import OrderSummary from "../components/checkout/OrderSummary";
import "./checkout.css";

const Checkout = () => {
  return (
    <div className="checkout-page">
      <h1>Checkout</h1>

      <div className="checkout-container">
        <div className="checkout-left">
          <AddressSection />
          <PaymentSection />
          <ReviewItems />
        </div>

        <div className="checkout-right">
          <OrderSummary />
        </div>
      </div>
    </div>
  );
};

export default Checkout;