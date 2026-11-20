import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL =
  process.env.REACT_APP_API_URL || "http://localhost:3001";

const emptyAddress = {
  fullName: "",
  phone: "",
  addressLine1: "",
  addressLine2: "",
  city: "",
  state: "",
  pincode: "",
};

const AddressSection = () => {
  const navigate = useNavigate();

  const currentUser = JSON.parse(
    localStorage.getItem("user") || "null"
  );

  const userId = currentUser?._id || currentUser?.id;

  const [address, setAddress] = useState(null);
  const [form, setForm] = useState(emptyAddress);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchAddress = useCallback(async () => {
    if (!userId) {
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(
        `${API_URL}/api/address/${userId}`
      );

      setAddress(response.data);
      setForm({
        fullName: response.data.fullName || "",
        phone: response.data.phone || "",
        addressLine1: response.data.addressLine1 || "",
        addressLine2: response.data.addressLine2 || "",
        city: response.data.city || "",
        state: response.data.state || "",
        pincode: response.data.pincode || "",
      });
    } catch (err) {
      if (err.response?.status !== 404) {
        console.error("Fetch address error:", err);
      }

      setAddress(null);
      setEditing(true);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    fetchAddress();
  }, [fetchAddress]);

  const handleChange = (event) => {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,
    }));
  };

  const saveAddress = async (event) => {
    event.preventDefault();

    if (!userId) {
      alert("Please log in before adding an address.");
      navigate("/login");
      return;
    }

    try {
      setSaving(true);

      const payload = {
        userId,
        ...form,
      };

      const response = address
        ? await axios.put(
            `${API_URL}/api/address/${userId}`,
            payload
          )
        : await axios.post(
            `${API_URL}/api/address`,
            payload
          );

      setAddress(response.data);
      setForm({
        fullName: response.data.fullName || "",
        phone: response.data.phone || "",
        addressLine1: response.data.addressLine1 || "",
        addressLine2: response.data.addressLine2 || "",
        city: response.data.city || "",
        state: response.data.state || "",
        pincode: response.data.pincode || "",
      });

      setEditing(false);
    } catch (err) {
      console.error("Save address error:", err);

      alert(
        err.response?.data?.message ||
          "Could not save the address."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="checkout-card">
        <h2>Delivery Address</h2>
        <p>Loading address...</p>
      </div>
    );
  }

  return (
    <div className="checkout-card">
      <div className="checkout-card-heading">
        <h2>Delivery Address</h2>

        {address && !editing && (
          <button
            type="button"
            className="address-change-btn"
            onClick={() => setEditing(true)}
          >
            Change
          </button>
        )}
      </div>

      {address && !editing ? (
        <div className="saved-address">
          <strong>{address.fullName}</strong>
          <p>{address.addressLine1}</p>

          {address.addressLine2 && (
            <p>{address.addressLine2}</p>
          )}

          <p>
            {address.city}, {address.state} {address.pincode}
          </p>

          <p>Phone: {address.phone}</p>
        </div>
      ) : (
        <form className="address-form" onSubmit={saveAddress}>
          <input
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
            placeholder="Full name"
            required
          />

          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="10-digit mobile number"
            inputMode="numeric"
            pattern="[0-9]{10}"
            required
          />

          <input
            name="addressLine1"
            value={form.addressLine1}
            onChange={handleChange}
            placeholder="Flat, house number, building"
            required
          />

          <input
            name="addressLine2"
            value={form.addressLine2}
            onChange={handleChange}
            placeholder="Area, street or landmark (optional)"
          />

          <div className="address-form-row">
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              placeholder="City"
              required
            />

            <input
              name="state"
              value={form.state}
              onChange={handleChange}
              placeholder="State"
              required
            />
          </div>

          <input
            name="pincode"
            value={form.pincode}
            onChange={handleChange}
            placeholder="6-digit pincode"
            inputMode="numeric"
            pattern="[0-9]{6}"
            required
          />

          <div className="address-actions">
            <button
              type="submit"
              className="address-save-btn"
              disabled={saving}
            >
              {saving ? "Saving..." : "Use this address"}
            </button>

            {address && (
              <button
                type="button"
                className="address-cancel-btn"
                onClick={() => setEditing(false)}
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default AddressSection;