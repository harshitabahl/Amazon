import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import axios from "axios";

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(null);

  const fetchCart = useCallback(async () => {
  try {
    const res = await axios.get(
      "https://amazon-7t4h.onrender.com/api/cart/demo-user"
    );

    setCart(res.data);
  } catch (err) {
    console.error(err);
  }
}, []);

  useEffect(() => {
  fetchCart();
  }, []);

  const quantity =
    cart?.items?.reduce(
      (sum, item) => sum + item.quantity,
      0
    ) || 0;
    console.log("Cart updated:", cart);
    console.log("Quantity:", quantity);
    console.log("CartProvider Render");

  return (
    <CartContext.Provider
      value={{
        cart,
        quantity,
        fetchCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);