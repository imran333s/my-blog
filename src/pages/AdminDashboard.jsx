import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import AddBlog from "./AddBlog";
import BlogList from "./BlogList";

const AdminDashboard = ({onLogout}) => {
  const [activePage, setActivePage] = useState("add-blog");
  const navigate = useNavigate();

  const handleLogout = () => {
    // Clear login/session data if stored
    localStorage.removeItem("adminLoggedIn");
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
          boxShadow: "2px 0 5px rgba(0,0,0,0.1)"
        }}
      >
        <h2 style={{ marginBottom: "20px" }}>Admin Panel</h2>
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
            marginTop: "30px"
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
  padding: "10px 15px",
  marginBottom: "10px",
  border: "none",
  borderRadius: "4px",
  background: active ? "#007bff" : "#ffffff",
  color: active ? "#ffffff" : "#333",
  textAlign: "left",
  cursor: "pointer",
  fontWeight: 600
});

export default AdminDashboard;
