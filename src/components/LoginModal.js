import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginModal.css"; 

const LoginModal = ({ isOpen, onClose }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          onClose();  
          navigate("/admin/dashboard");  
        }
      } else {
        const errData = await response.json();
        alert(errData.message);  
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong! Please try again.");
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
