import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddBlog from "./AddBlog";
import BlogList from "./BlogList";

const AdminDashboard = ({ onLogout }) => {
  const [activePage, setActivePage] = useState("add-blog");
  const navigate = useNavigate();

  const handleLogout = () => {
   // Remove the JWT token from localStorage
  localStorage.removeItem("token");
    if (onLogout) {
      onLogout();
    }

    // Redirect to home page
    navigate("/");
  };

  const renderContent = () => {
    switch (activePage) {
      case "add-blog":
        return <AddBlog />;
      case "blog-list":
        return <BlogList />;
      default:
        return <AddBlog />;
    }
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      {/* Sidebar */}
      <aside
        style={{
          width: "220px",
          background: "#f8f9fa",
          padding: "20px",
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ fontSize: "1.5rem", marginBottom: "30px" }}>
          Admin Panel
        </h2>
        <button
          style={sidebarBtnStyle(activePage === "add-blog")}
          onClick={() => setActivePage("add-blog")}
        >
          Add Blog
        </button>
        <button
          style={sidebarBtnStyle(activePage === "blog-list")}
          onClick={() => setActivePage("blog-list")}
        >
          Blog List
        </button>

        {/* Logout Button */}
        <button
          style={{
            ...sidebarBtnStyle(false),
            background: "#dc3545",
            color: "#fff",
            marginTop: "30px",
          }}
          onClick={handleLogout}
        >
          Logout
        </button>
      </aside>

      {/* Main Content */}
      <main style={{ flex: 1, padding: "20px" }}>{renderContent()}</main>
    </div>
  );
};

// Sidebar button styles
const sidebarBtnStyle = (active) => ({
  display: "block",
  width: "100%",
  padding: "12px 15px",
  marginBottom: "15px",
  border: "none",
  borderRadius: "8px",
  background: active
    ? "linear-gradient(90deg, #79da84ff )" // gradient for active
    : "#374151", // dark grey for inactive
  color: active ? "#1f2937" : "#e5e7eb",
  textAlign: "left",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "0.95rem",
  boxShadow: active
    ? "0 4px 12px rgba(160, 206, 99, 0.5)" // subtle shadow for active
    : "0 2px 5px rgba(0,0,0,0.15)",
  transition: "all 0.3s ease",
  position: "relative",
  overflow: "hidden",
});

// Add hover effect
const hoverEffect = (e) => {
  e.currentTarget.style.transform = "translateX(5px)";
  e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.2)";
};

const removeHoverEffect = (e) => {
  e.currentTarget.style.transform = "translateX(0)";
  e.currentTarget.style.boxShadow = sidebarBtnStyle(false).boxShadow;
};

export default AdminDashboard;
