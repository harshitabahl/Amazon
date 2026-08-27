import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Profile = () => {
  const [address, setAddress] = useState(null);
  const [loadingAddress, setLoadingAddress] = useState(true);

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const userId = currentUser?._id || currentUser?.id;

  const fetchAddress = useCallback(async () => {
    if (!userId) {
      setAddress(null);
      setLoadingAddress(false);
      return;
    }

    try {
      const res = await axios.get(
        `https://amazon-7t4h.onrender.com/api/address/${userId}`
      );

      setAddress(res.data);
    } catch (err) {
      console.log("No saved address");
      setAddress(null);
    } finally {
      setLoadingAddress(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAddress();
  }, [fetchAddress]);

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Please login to view your profile
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">

        <h1 className="text-3xl font-semibold mb-6">
          Your Account
        </h1>

        {/* Profile */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-5">
            👤 Profile
          </h2>

          <div className="space-y-3">
            <div>
              <p className="text-sm text-gray-500">
                Name
              </p>

              <p className="text-lg">
                {currentUser.username || "Not available"}
              </p>
            </div>

            <div>
              <p className="text-sm text-gray-500">
                Email
              </p>

              <p className="text-lg">
                {currentUser.email || "Not available"}
              </p>
            </div>
          </div>
        </div>

        {/* Address */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <h2 className="text-xl font-semibold mb-5">
            📍 Your Address
          </h2>

          {loadingAddress ? (
            <p className="text-gray-500">
              Loading address...
            </p>
          ) : address ? (
            <div className="space-y-1">
              <p>
                <strong>{address.fullName}</strong>
              </p>

              <p>{address.addressLine1}</p>

              {address.addressLine2 && (
                <p>{address.addressLine2}</p>
              )}

              <p>
                {address.city}, {address.state}
              </p>

              <p>{address.pincode}</p>

              <p className="mt-2">
                📞 {address.phone}
              </p>
            </div>
          ) : (
            <div>
              <p className="text-gray-500">
                No saved address.
              </p>

              <Link
                to="/checkout"
                className="inline-block mt-4 bg-yellow-400 px-5 py-2 rounded-md"
              >
                + Add Address
              </Link>
            </div>
          )}
        </div>

        {/* Orders & Wishlist */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <Link
            to="/orders"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold mb-2">
              📦 Your Orders
            </h2>

            <p className="text-gray-600">
              Track, return, or view your orders
            </p>
          </Link>

          <Link
            to="/wishlist"
            className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition"
          >
            <h2 className="text-xl font-semibold mb-2">
              ❤️ Your Wishlist
            </h2>

            <p className="text-gray-600">
              View products you've saved
            </p>
          </Link>

        </div>

      </div>
    </div>
  );
};

export default Profile;