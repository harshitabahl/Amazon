import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import {
  User,
  Mail,
  MapPin,
  Phone,
  Package,
  Heart,
  ChevronRight,
} from "lucide-react";

import "../styles/profile.css";

const API_URL = "https://amazon-7t4h.onrender.com";

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
        `${API_URL}/api/address/${userId}`
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
      <div className="profile-login-page">
        <div className="profile-login-card">
          <div className="profile-login-icon">
            <User size={38} />
          </div>

          <h2>Please sign in</h2>

          <p>
            Sign in to view your account, orders and wishlist.
          </p>

          <Link to="/login" className="profile-login-btn">
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-page">

      {/* HERO */}
      <section className="profile-hero">
        <div className="profile-container">
          <div className="profile-hero-content">

           <div className="profile-avatar">
            <User size={42} strokeWidth={2.2} />
          </div>

            <div>
              <p className="profile-welcome">
                Welcome back
              </p>

              <h1>
                {currentUser.username || "User"}
              </h1>

              <p className="profile-subtitle">
                Manage your account, orders and saved products
              </p>
            </div>

          </div>
        </div>
      </section>

      <main className="profile-container profile-main">

        {/* PROFILE + ADDRESS */}
        <div className="profile-top-grid">

          {/* PROFILE INFO */}
          <section className="profile-card">

            <div className="profile-card-header">
              <div className="profile-card-icon profile-icon-blue">
                <User size={22} />
              </div>

              <div>
                <h2>Profile</h2>
                <p>Your account information</p>
              </div>
            </div>

            <div className="profile-info-list">

              <div className="profile-info-row">
                <div className="profile-info-icon">
                  <User size={18} />
                </div>

                <div>
                  <span>Name</span>
                  <strong>
                    {currentUser.username || "Not available"}
                  </strong>
                </div>
              </div>

              <div className="profile-info-row">
                <div className="profile-info-icon">
                  <Mail size={18} />
                </div>

                <div>
                  <span>Email</span>
                  <strong>
                    {currentUser.email || "Not available"}
                  </strong>
                </div>
              </div>

            </div>
          </section>

          {/* ADDRESS */}
          <section className="profile-card">

            <div className="profile-card-header">
              <div className="profile-card-icon profile-icon-red">
                <MapPin size={22} />
              </div>

              <div>
                <h2>Your Address</h2>
                <p>Your saved delivery address</p>
              </div>
            </div>

            <div className="profile-address-body">

              {loadingAddress ? (
                <p className="profile-muted">
                  Loading address...
                </p>
              ) : address ? (
                <>
                  <div className="profile-address-box">

                    <h3>{address.fullName}</h3>

                    <p>{address.addressLine1}</p>

                    {address.addressLine2 && (
                      <p>{address.addressLine2}</p>
                    )}

                    <p>
                      {address.city}, {address.state}
                    </p>

                    <p className="profile-pincode">
                      {address.pincode}
                    </p>

                    {address.phone && (
                      <div className="profile-phone">
                        <Phone size={16} />
                        <span>{address.phone}</span>
                      </div>
                    )}

                  </div>

                  <Link
                    to="/checkout"
                    className="profile-address-link"
                  >
                    Change delivery address
                  </Link>
                </>
              ) : (
                <div className="profile-empty-address">

                  <MapPin size={38} />

                  <p>No saved address</p>

                  <Link
                    to="/checkout"
                    className="profile-primary-btn"
                  >
                    Add Address
                  </Link>

                </div>
              )}

            </div>
          </section>

        </div>

        {/* ACCOUNT ACTIONS */}
        <div className="profile-section-heading">
          <h2>Your Account</h2>
          <p>
            Quickly access your orders and saved products
          </p>
        </div>

        <div className="profile-action-grid">

          {/* ORDERS */}
          <Link
            to="/orders"
            className="profile-action-card"
          >
            <div className="profile-action-left">

              <div className="profile-action-icon profile-orders-icon">
                <Package size={29} />
              </div>

              <div>
                <h3>Your Orders</h3>
                <p>
                  Track, return or view your orders
                </p>
              </div>

            </div>

            <ChevronRight
              size={24}
              className="profile-arrow"
            />
          </Link>

          {/* WISHLIST */}
          <Link
            to="/wishlist"
            className="profile-action-card"
          >
            <div className="profile-action-left">

              <div className="profile-action-icon profile-wishlist-icon">
                <Heart size={29} fill="currentColor" />
              </div>

              <div>
                <h3>Your Wishlist</h3>
                <p>
                  View products you've saved
                </p>
              </div>

            </div>

            <ChevronRight
              size={24}
              className="profile-arrow"
            />
          </Link>

        </div>

      </main>
    </div>
  );
};

export default Profile;