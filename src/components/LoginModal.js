import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from "axios"; // ✅ import axios
import "./LoginModal.css";

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      // ✅ POST request to backend
      const { data } = await axios.post(
        "http://localhost:5000/api/admin/login",
        {
          email,
          password,
        }
      );

      if (data.success) {
        // ✅ store JWT token in localStorage
        localStorage.setItem("token", data.token);
        console.log("Logged in! Token:", data.token);

        // ✅ Show SweetAlert for success
        await Swal.fire({
          title: "Login Successful!",
          text: "Welcome back, Admin 👋",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "Continue",
        });

        // Close modal and navigate to admin dashboard
        onClose();
        navigate("/admin/dashboard");
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
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Admin Login</h2>
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
        <button className="close-btn" onClick={onClose}>
          ✖
        </button>
      </div>
    </div>
  );
};

export default LoginModal;
