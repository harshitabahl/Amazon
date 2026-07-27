import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/auth.css";

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // 1. login (sets cookie)
      await axios.post(
        "https://amazon-7t4h.onrender.com/api/auth/login",
        { email, password },
        { withCredentials: true }
      );

      // 2. fetch user (/me)
      const res = await axios.get(
        "https://amazon-7t4h.onrender.com/api/auth/me",
        { withCredentials: true }
      );



      // 3. save user in localStorage
        localStorage.setItem(
        "user",
        JSON.stringify(res.data)
        );

        // 4. update state
        setUser(res.data);

        // 5. redirect home
        window.location.href = "/";
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-wrapper">
        <h2 className="auth-title">Login</h2>

        <form onSubmit={handleLogin}>
          <input
            className="auth-input"
            type="text"
            placeholder="Email"
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="auth-input"
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          {error && <p className="auth-error">{error}</p>}

          <p style={{ fontSize: "13px", marginTop: "10px" }}>
            Don’t have an account?{" "}
            <span
              style={{
                color: "blue",
                cursor: "pointer",
                textDecoration: "underline",
              }}
              onClick={() => navigate("/login")}
            >
              Sign up
            </span>
          </p>

          <button className="auth-button" type="submit">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;