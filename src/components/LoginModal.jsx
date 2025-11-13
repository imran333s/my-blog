import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios";
import "./LoginModal.css";

const LoginModal = ({ isOpen, onClose, role = "admin" }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // Select endpoint based on role
      const endpoint =
        role === "admin"
          ? "http://localhost:5000/api/admin/login"
          : "http://localhost:5000/api/employees/login";

      const { data } = await axios.post(endpoint, { email, password });

      if (data.success) {
        // Store JWT token
        localStorage.setItem("token", data.token);

        // SweetAlert success
        await Swal.fire({
          title: "Login Successful!",
          text: `Welcome back, ${role === "admin" ? "Admin" : "Employee"} 👋`,
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Continue",
        });

        // Close modal and redirect
        onClose();
        navigate(role === "admin" ? "/admin/dashboard" : "/admin/dashboard");
      } else {
        Swal.fire({
          title: "Login Failed",
          text: data.message || "Invalid credentials!",
          icon: "error",
          confirmButtonColor: "#d33",
        });
      }
    } catch (err) {
      Swal.fire({
        title: "Error",
        text:
          err.response?.data?.message ||
          "Something went wrong! Please try again.",
        icon: "error",
        confirmButtonColor: "#d33",
      });
    }
  };

  return (
    <div className="login-modal-overlay">
      <div className="login-modal-content">
        <h2>{role === "admin" ? "Admin Login" : "Employee Login"}</h2>
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
            navigate("/");
          }}
        >
          ✖
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
