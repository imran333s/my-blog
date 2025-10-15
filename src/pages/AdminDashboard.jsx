import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddBlog from "./AddBlog";
import BlogList from "./BlogList";
import AddCategory from "./AddCategory";
import CategoryList from "./CategoryList";
import AdminHeader from "./AdminHeader";

const AdminDashboard = ({ onLogout }) => {
  const [activePage, setActivePage] = useState("blog-list");
  const [adminInfo, setAdminInfo] = useState({ name: "", role: "" });
  const [websiteName, setWebsiteName] = useState("The Daily Digest");
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;
  const handleLogout = () => {
    localStorage.removeItem("token");
    if (onLogout) onLogout();
    navigate("/");
  };

  const renderContent = () => {
    switch (activePage) {
      case "add-blog":
        return <AddBlog />;
      case "blog-list":
        return <BlogList />;
      case "add-category":
        return <AddCategory />;
      case "category-list":
        return <CategoryList />;
      default:
        return <AddBlog />;
    }
  };

  useEffect(() => {
    const fetchAdminInfo = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/admin/me`); // no headers

        const data = response.data;
        setAdminInfo({ name: data.name, role: data.role });
      } catch (error) {
        console.error("Failed to fetch admin info:", error);
      }
    };

    fetchAdminInfo();
  }, []);

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      {/* Top Header */}
      <AdminHeader
        adminName={adminInfo.name}
        role={adminInfo.role}
        onLogout={handleLogout}
        websiteName={websiteName} // pass website name dynamically
      />

      {/* Main content layout */}
      <div style={{ display: "flex", flex: 1, }}>
        {/* Sidebar */}
        <aside
          style={{
            width: "160px",
            background: "#405e7cff",
            padding: "90px 10px",
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
            Add News
          </button>
          <button
            style={sidebarBtnStyle(activePage === "blog-list")}
            onClick={() => setActivePage("blog-list")}
          >
            News List
          </button>
          <button
            style={sidebarBtnStyle(activePage === "add-category")}
            onClick={() => setActivePage("add-category")}
          >
            Add Category
          </button>
          <button
            style={sidebarBtnStyle(activePage === "category-list")}
            onClick={() => setActivePage("category-list")}
          >
            Category List
          </button>
        </aside>

        {/* Main Content */}
        <main style={{ flex: 1, padding: "20px" }}>{renderContent()}</main>
      </div>
    </div>
  );
};

// Sidebar button styles
const sidebarBtnStyle = (active) => ({
  display: "block",
  width: "90%",
  padding: "12px 15px",
  marginBottom: "15px",
  border: "none",
  borderRadius: "8px",
  background: active ? "linear-gradient(90deg, #79da84ff )" : "#374151",
  color: active ? "#1f2937" : "#e5e7eb",
  textAlign: "left",
  cursor: "pointer",
  fontWeight: 600,
  fontSize: "0.95rem",
  boxShadow: active
    ? "0 4px 12px rgba(160, 206, 99, 0.5)"
    : "0 2px 5px rgba(0,0,0,0.15)",
  transition: "all 0.3s ease",
});

export default AdminDashboard;
