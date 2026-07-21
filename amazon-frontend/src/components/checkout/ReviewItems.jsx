import { useCart } from "../../context/cartContext";

const ReviewItems = () => {
  const { cart } = useCart();

  if (!cart || cart.items.length === 0) {
    return null;
  }

  return (
    <div className="checkout-card">
      <h2>Review Items</h2>

      {cart.items.map((item) => (
        <div className="review-item" key={item._id}>
          <img
            className="review-image"
            src={item.productId.img}
            alt={item.productId.title}
          />

          <div className="review-details">
            <h3>{item.productId.title}</h3>

            <p>₹{item.productId.price}</p>

            <p>Quantity: {item.quantity}</p>

            <p className="stock">In Stock</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ReviewItems;