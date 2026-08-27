import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const userId = currentUser?._id || currentUser?.id;

  useEffect(() => {
    const fetchOrders = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `https://amazon-7t4h.onrender.com/api/orders/${userId}`
        );

        setOrders(res.data || []);
      } catch (err) {
        console.error("Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  // ================= LOGIN CHECK =================

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Please login to view your orders
          </h2>

          <Link
            to="/login"
            className="bg-yellow-400 px-6 py-2 rounded-md"
          >
            Login
          </Link>
        </div>
      </div>
    );
  }

  // ================= LOADING =================

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Loading orders...</p>
      </div>
    );
  }

  // ================= PAGE =================

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-semibold mb-6">
          Your Orders
        </h1>

        {/* ================= EMPTY ================= */}

        {orders.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-8 text-center">

            <div className="text-5xl mb-4">
              📦
            </div>

            <h2 className="text-xl font-semibold mb-2">
              You haven't placed any orders yet.
            </h2>

            <p className="text-gray-600">
              Your orders will appear here after you place an order.
            </p>

            <Link
              to="/products"
              className="inline-block mt-5 bg-yellow-400 px-6 py-2 rounded-md"
            >
              Start Shopping
            </Link>

          </div>
        ) : (

          /* ================= ORDERS ================= */

          <div className="space-y-6">

            {orders.map((order) => (
              <div
                key={order._id}
                className="bg-white rounded-lg shadow-sm p-6"
              >

                {/* ORDER HEADER */}

                <div className="flex flex-col md:flex-row md:justify-between gap-4 border-b pb-4 mb-4">

                  <div>
                    <p className="text-sm text-gray-500">
                      Order placed
                    </p>

                    <p className="font-medium">
                      {new Date(
                        order.createdAt
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      })}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Order ID
                    </p>

                    <p className="text-sm font-medium break-all">
                      {order._id}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Total
                    </p>

                    <p className="font-semibold">
                      ₹{order.amount}
                    </p>
                  </div>

                  <div>
                    <p className="text-sm text-gray-500">
                      Status
                    </p>

                    <span className="inline-block mt-1 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm">
                      {order.status}
                    </span>
                  </div>

                </div>

                {/* PRODUCTS */}

                <div className="space-y-4">

                  {order.products.map((product) => (
                    <div
                      key={product._id}
                      className="flex gap-4"
                    >

                      <img
                        src={product.image}
                        alt={product.title}
                        className="w-24 h-28 object-contain border rounded-md"
                        onError={(e) => {
                          e.currentTarget.style.display = "none";
                        }}
                      />

                      <div className="flex-1">

                        <h3 className="font-medium">
                          {product.title}
                        </h3>

                        <p className="text-gray-600 mt-2">
                          ₹{product.price}
                        </p>

                        <p className="text-gray-500">
                          Quantity: {product.quantity}
                        </p>

                      </div>

                    </div>
                  ))}

                </div>

                {/* ADDRESS */}

                {order.address && (
                  <div className="border-t mt-5 pt-4">

                    <h3 className="font-semibold mb-2">
                      Delivery Address
                    </h3>

                    <p>
                      {order.address.fullName}
                    </p>

                    <p>
                      {order.address.addressLine1}
                    </p>

                    {order.address.addressLine2 && (
                      <p>
                        {order.address.addressLine2}
                      </p>
                    )}

                    <p>
                      {order.address.city},{" "}
                      {order.address.state} -{" "}
                      {order.address.pincode}
                    </p>

                    <p className="mt-1">
                      📞 {order.address.phone}
                    </p>

                  </div>
                )}

                {/* PAYMENT */}

                <div className="border-t mt-5 pt-4">

                  <p>
                    <strong>Payment:</strong>{" "}
                    {order.paymentMethod}
                  </p>

                </div>

              </div>
            ))}

          </div>
        )}

      </div>
    </div>
  );
};

export default Orders;