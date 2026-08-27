import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Heart, Trash2 } from "lucide-react";
import { getPlaceholderImage } from "../placeholder/categoryPlaceholder";

const API_URL = "https://amazon-7t4h.onrender.com";

const Wishlist = () => {
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const userId = currentUser?._id || currentUser?.id;

  // ================= FETCH WISHLIST =================

  useEffect(() => {
    const fetchWishlist = async () => {
      if (!userId) {
        setLoading(false);
        return;
      }

      try {
        const res = await axios.get(
          `${API_URL}/api/wishlist/${userId}`
        );

        setProducts(res.data.products || []);
      } catch (err) {
        console.error(
          "Failed to fetch wishlist:",
          err
        );
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [userId]);

  // ================= REMOVE =================

  const removeFromWishlist = async (productId) => {
    try {
      await axios.delete(
        `${API_URL}/api/wishlist/${userId}/${productId}`
      );

      setProducts((prev) =>
        prev.filter(
          (product) => product._id !== productId
        )
      );
    } catch (err) {
      console.error(
        "Remove wishlist error:",
        err
      );

      alert(
        err.response?.data?.message ||
          "Failed to remove from wishlist"
      );
    }
  };

  // ================= IMAGE =================

  const getImage = (product) => {
    const img = product?.img;
    const title = product?.title || "";

    if (
      typeof img === "string" &&
      img.startsWith("http")
    ) {
      return img;
    }

    if (
      typeof img === "string" &&
      img.startsWith("/uploads")
    ) {
      return `${API_URL}${img}`;
    }

    return getPlaceholderImage(title);
  };

  // ================= NOT LOGGED IN =================

  if (!currentUser) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <div className="text-center">
          <h2 className="text-2xl font-semibold mb-4">
            Please login to view your wishlist
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
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p>Loading wishlist...</p>
      </div>
    );
  }

  // ================= PAGE =================

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center gap-3">
            <Heart
              size={28}
              fill="red"
              color="red"
            />

            <h1 className="text-3xl font-semibold">
              Your Wishlist
            </h1>
          </div>

          {products.length > 0 && (
            <p className="text-gray-600 mt-2">
              {products.length}{" "}
              {products.length === 1
                ? "item"
                : "items"}{" "}
              saved
            </p>
          )}
        </div>

        {/* Empty Wishlist */}
        {products.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm p-10 text-center">

            <Heart
              size={60}
              className="mx-auto mb-4 text-gray-300"
            />

            <h2 className="text-xl font-semibold mb-2">
              Your wishlist is empty
            </h2>

            <p className="text-gray-500 mb-6">
              Save products you love to find
              them later.
            </p>

            <Link
              to="/products"
              className="inline-block bg-yellow-400 px-6 py-3 rounded-md font-medium hover:bg-yellow-500"
            >
              Start Shopping
            </Link>

          </div>
        ) : (
          /* Products */
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {products.map((product) => {
              const price =
                Number(product?.price) || 299;

              return (
                <div
                  key={product._id}
                  className="bg-white rounded-lg shadow-sm p-5"
                >

                  <div className="flex gap-5">

                    {/* Image */}
                    <img
                      src={getImage(product)}
                      alt={product.title}
                      className="w-32 h-36 object-contain border rounded-md cursor-pointer"
                      onClick={() =>
                        navigate(
                          `/product/${product._id}`
                        )
                      }
                      onError={(e) => {
                        e.currentTarget.onerror =
                          null;

                        e.currentTarget.src =
                          getPlaceholderImage(
                            product.title || ""
                          );
                      }}
                    />

                    {/* Details */}
                    <div className="flex-1">

                      <p className="text-sm text-gray-500 mb-1">
                        {product.brand ||
                          "Amazon Brand"}
                      </p>

                      <h2
                        className="font-semibold text-lg cursor-pointer hover:text-blue-600"
                        onClick={() =>
                          navigate(
                            `/product/${product._id}`
                          )
                        }
                      >
                        {product.title}
                      </h2>

                      <p className="text-xl font-semibold mt-3">
                        ₹{price}
                      </p>

                      {product.inStock === false && (
                        <p className="text-red-600 text-sm mt-2">
                          Currently unavailable
                        </p>
                      )}

                      {/* Remove */}
                      <button
                        type="button"
                        onClick={() =>
                          removeFromWishlist(
                            product._id
                          )
                        }
                        className="flex items-center gap-2 mt-4 text-red-600 hover:text-red-800"
                      >
                        <Trash2 size={17} />

                        Remove
                      </button>

                    </div>
                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>
    </div>
  );
};

export default Wishlist;