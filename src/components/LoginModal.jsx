import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import "./LoginModal.css";

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ✅ API URL (works locally + Netlify)
  const API_URL = process.env.REACT_APP_API_URL ;

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        `${API_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );

      if (data.success) {
        localStorage.setItem("token", data.token);

        // LOWERCASE ROLE ALWAYS
        const userRole = data.user.role.toLowerCase();

        await Swal.fire({
          title: "Login Successful!",
          text: `Welcome back, ${userRole}!`,
          icon: "success",
        });

        onClose();

        // REDIRECT BASED ON ROLE (unchanged)
        if (userRole === "admin") {
          navigate("/admin/dashboard");
        } else if (userRole === "manager") {
          navigate("/admin/dashboard");
        } else {
          navigate("/admin/dashboard");
        }
      } else {
        Swal.fire({
          title: "Login Failed",
          text: data.message || "Invalid credentials!",
          icon: "error",
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text: err.response?.data?.message || "Something went wrong!",
        icon: "error",
      });
    }
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal-content">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit">Login</button>
        </form>
        <button
          className="close-btn"
          onClick={() => {
            onClose();
          }}
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
