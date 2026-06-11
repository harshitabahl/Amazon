import "./app.css";

import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Home from "./pages/Home/Home";
import UserList from "./pages/userList/UserList";
import User from "./pages/user/User";
import NewUser from "./pages/newUser/NewUser";
import ProductList from "./pages/productList/ProductList";
import Product from "./pages/product/Product";
import NewProduct from "./pages/newProduct/NewProduct";
import Login from "./pages/login/Login";

function App() {

  const admin =
    JSON.parse(
      JSON.parse(localStorage.getItem("persist:root")).user
    ).currentUser?.isAdmin;

  return (
    <Router>
      <Routes>

        {/* LOGIN */}
        <Route
          path="/login"
          element={
            admin ? <Navigate to="/" /> : <Login />
          }
        />

        {/* HOME */}
        <Route
          path="/"
          element={
            admin ? (
              <>
                <Topbar />
                <div className="container">
                  <Sidebar />
                  <Home />
                </div>
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* USERS */}
        <Route
          path="/users"
          element={
            admin ? (
              <>
                <Topbar />
                <div className="container">
                  <Sidebar />
                  <UserList />
                </div>
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* SINGLE USER */}
        <Route
          path="/user/:userId"
          element={
            admin ? (
              <>
                <Topbar />
                <div className="container">
                  <Sidebar />
                  <User />
                </div>
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* NEW USER */}
        <Route
          path="/newUser"
          element={
            admin ? (
              <>
                <Topbar />
                <div className="container">
                  <Sidebar />
                  <NewUser />
                </div>
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* PRODUCTS */}
        <Route
          path="/products"
          element={
            admin ? (
              <>
                <Topbar />
                <div className="container">
                  <Sidebar />
                  <ProductList />
                </div>
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* SINGLE PRODUCT */}
        <Route
          path="/product/:productId"
          element={
            admin ? (
              <>
                <Topbar />
                <div className="container">
                  <Sidebar />
                  <Product />
                </div>
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* NEW PRODUCT */}
        <Route
          path="/newproduct"
          element={
            admin ? (
              <>
                <Topbar />
                <div className="container">
                  <Sidebar />
                  <NewProduct />
                </div>
              </>
            ) : (
              <Navigate to="/login" />
            )
          }
        />

      </Routes>
    </Router>
  );
}

export default App;