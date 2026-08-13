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
    const currentUser = JSON.parse(
      localStorage.getItem("user") || "null"
    );

    const userId = currentUser?._id || currentUser?.id;

    // No logged-in user = empty cart
    if (!userId) {
      setCart({
        userId: null,
        items: [],
      });
      return;
    }

    try {
      const res = await axios.get(
        `https://amazon-7t4h.onrender.com/api/cart/${userId}`
      );

      setCart(res.data);
    } catch (err) {
      console.error("Cart fetch error:", err);

      setCart({
        userId,
        items: [],
      });
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  const quantity =
    cart?.items?.reduce(
      (sum, item) => sum + item.quantity,
      0
    ) || 0;

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