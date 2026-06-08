import { Routes, Route } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Cart from "./pages/Cart";
import Product from "./pages/Product";
import ProductList from "./pages/ProductList";
import Success from "./pages/Success";

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />

      <Route
        path="/products/:category"
        element={<ProductList />}
      />

      <Route
        path="/product/:id"
        element={<Product />}
      />

      <Route path="/cart" element={<Cart />} />

      <Route path="/success" element={<Success />} />

      <Route path="/login" element={<Login />} />

      <Route path="/register" element={<Register />} />
    </Routes>
  );
};

export default App;