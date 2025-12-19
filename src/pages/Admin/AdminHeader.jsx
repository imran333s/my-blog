import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";
import { jwtDecode as jwt_decode } from "jwt-decode";
import "./AdminHeader.css"; // ✅ Import the new CSS

const AdminHeader = ({ websiteName, onLogout }) => {
  const [user, setUser] = useState({ name: "", role: "" });

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwt_decode(token);
        setUser({
          name: decoded.name || "User",
          role: decoded.role || "Employee",
        });
      } catch (err) {
        console.error("Invalid token", err);
      }
    }
  }, []);

  const handleLogout = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "You will be logged out!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#dc3545",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, logout!",
    }).then((result) => {
      if (result.isConfirmed) {
        localStorage.removeItem("token");
        onLogout();
        Swal.fire({
          title: "Logged out!",
          text: "You have been successfully logged out.",
          icon: "success",
          timer: 1500,
          showConfirmButton: false,
        });
      }
    });
  };

  return (
    <header className="admin-header">
      <div className="website-name">{websiteName}</div>

      <div className="header-right">
        <div className="user-info">
          <span className="user-name">{user.name}</span>
          <span className="user-role">({user.role})</span>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
