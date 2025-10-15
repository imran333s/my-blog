import React from "react";
import Swal from "sweetalert2";

const AdminHeader = ({ websiteName, adminName, role, onLogout }) => {
  const handleLogout = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: "You will be logged out!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#dc3545',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Yes, logout!',
    }).then((result) => {
      if (result.isConfirmed) {
        onLogout(); // call the actual logout function
        Swal.fire({
          title: 'Logged out!',
          text: 'You have been successfully logged out.',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false
        });
      }
    });
  };

  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 50px",
        backgroundColor: "#1f2937",
        color: "#fff",
        boxShadow: "0 2px 5px rgba(0,0,0,0.1)",
      }}
    >
      <div style={{ fontSize: "1rem", fontWeight: "bold", marginLeft: "180px" }}>
        {websiteName}
      </div>

      <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
        <div>
          Signed in as: {adminName} ({role})
        </div>
        <button
          onClick={handleLogout}
          style={{
            padding: "8px 15px",
            border: "none",
            borderRadius: "6px",
            backgroundColor: "#dc3545",
            color: "#fff",
            cursor: "pointer",
            fontWeight: 600,
          }}
        >
          Logout
        </button>
      </div>
    </header>
  );
};

export default AdminHeader;
