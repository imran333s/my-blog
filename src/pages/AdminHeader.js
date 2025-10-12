import React from "react";

const AdminHeader = ({ websiteName, adminName, role, onLogout }) => {
  return (
    <header
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 100px",
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
          onClick={onLogout}
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
