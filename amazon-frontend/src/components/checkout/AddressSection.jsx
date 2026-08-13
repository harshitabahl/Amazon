import { useCallback, useEffect, useState } from "react";
import axios from "axios";

const AddressSection = () => {
  const [showForm, setShowForm] = useState(false);
  const [address, setAddress] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    addressLine1: "",
    addressLine2: "",
    city: "",
    state: "",
    pincode: "",
  });

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const userId = currentUser?._id || currentUser?.id;

  const fetchAddress = useCallback(async () => {
    if (!userId) {
      console.log("No logged-in user found");
      setAddress(null);
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
    }
  }, [userId]);

  useEffect(() => {
    fetchAddress();
  }, [fetchAddress]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const saveAddress = async () => {
    if (!userId) {
      alert("Please login first");
      return;
    }

    try {
      await axios.post(
        "https://amazon-7t4h.onrender.com/api/address",
        {
          userId,
          ...formData,
        }
      );

      await fetchAddress();
      setShowForm(false);
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ||
          "Failed to save address"
      );
    }
  };

  const handleEditAddress = () => {
    setFormData({
      fullName: address.fullName || "",
      phone: address.phone || "",
      addressLine1: address.addressLine1 || "",
      addressLine2: address.addressLine2 || "",
      city: address.city || "",
      state: address.state || "",
      pincode: address.pincode || "",
    });

    setShowForm(true);
  };

  if (!userId) {
    return (
      <div className="checkout-card">
        <h2>📍 Delivery Address</h2>
        <p>Please login to continue with checkout.</p>
      </div>
    );
  }

  if (address && !showForm) {
    return (
      <div className="checkout-card">
        <h2>📍 Delivery Address</h2>

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

        <p>📞 {address.phone}</p>

        <button
          className="address-btn"
          onClick={handleEditAddress}
        >
          Change Address
        </button>
      </div>
    );
  }

  return (
    <div className="checkout-card">
      <h2>📍 Delivery Address</h2>

      {!showForm ? (
        <>
          <p>No delivery address selected.</p>

          <button
            className="checkout-btn"
            onClick={() => setShowForm(true)}
          >
            + Add Address
          </button>
        </>
      ) : (
        <>
          <input
            type="text"
            name="fullName"
            placeholder="Full Name"
            value={formData.fullName}
            onChange={handleChange}
          />

          <input
            type="text"
            name="phone"
            placeholder="Phone Number"
            value={formData.phone}
            onChange={handleChange}
          />

          <input
            type="text"
            name="addressLine1"
            placeholder="Address Line 1"
            value={formData.addressLine1}
            onChange={handleChange}
          />

          <input
            type="text"
            name="addressLine2"
            placeholder="Address Line 2"
            value={formData.addressLine2}
            onChange={handleChange}
          />

          <input
            type="text"
            name="city"
            placeholder="City"
            value={formData.city}
            onChange={handleChange}
          />

          <input
            type="text"
            name="state"
            placeholder="State"
            value={formData.state}
            onChange={handleChange}
          />

          <input
            type="text"
            name="pincode"
            placeholder="Pincode"
            value={formData.pincode}
            onChange={handleChange}
          />

          <button
            className="checkout-btn"
            onClick={saveAddress}
          >
            Save Address
          </button>
        </>
      )}
    </div>
  );
};

export default AddressSection;