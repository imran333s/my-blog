import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AddBlog from "./AddBlog";
import BlogList from "./BlogList";
import AddCategory from "../Category/AddCategory";
import CategoryList from "../Category/CategoryList";
import AdminHeader from "./AdminHeader";
import AddEmployee from "../Employee/AddEmployee";
import EmployeeList from "../Employee/EmployeeList";
import EditEmployee from "../Employee/EditEmployee";
import NewsDashboard from "./NewsDashboard";
import AdminEditContactSettings from "./AdminEditContactSettings";

const AdminDashboard = ({ onLogout }) => {
  const [activePage, setActivePage] = useState(
    localStorage.getItem("activePage") || "dashboard"
  );
  const [adminInfo, setAdminInfo] = useState({ name: "", role: "" });
  const [websiteName, setWebsiteName] = useState("News Pulse");
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("activePage");
    if (onLogout) onLogout();
    navigate("/");
  };

  // ✅ Save active page to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("activePage", activePage);
  }, [activePage]);

  const renderContent = () => {
    switch (activePage) {
      case "dashboard":
        return <NewsDashboard />;
      case "add-blog":
        return <AddBlog />;
      case "blog-list":
        return <BlogList />;
      case "add-category":
        return <AddCategory />;
      case "category-list":
        return <CategoryList />;
      case "add-employee":
        return (
          <AddEmployee
            onEmployeeUpdated={() => setActivePage("employee-list")}
          />
        );
      case "employee-list":
        return (
          <EmployeeList onEdit={(id) => setActivePage(`edit-employee-${id}`)} />
        );
      case "contact-settings":
        return <AdminEditContactSettings />;

      default:
        if (activePage.startsWith("edit-employee-")) {
          const id = activePage.replace("edit-employee-", "");
          return (
            <EditEmployee
              employeeId={id}
              onUpdate={() => setActivePage("employee-list")}
            />
          );
        }
        return <NewsDashboard />;
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
      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <aside
          style={{
            width: "160px",
            background: "#405e7cff",
            padding: "20px 10px",
            boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", marginBottom: "30px" }}>
            Admin Panel
          </h2>
          <button
            style={sidebarBtnStyle(activePage === "dashboard")}
            onClick={() => setActivePage("dashboard")}
          >
            Dashboard
          </button>

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
          <button
            style={sidebarBtnStyle(activePage === "add-employee")}
            onClick={() => setActivePage("add-employee")}
          >
            Add Employee
          </button>
          <button
            style={sidebarBtnStyle(activePage === "employee-list")}
            onClick={() => setActivePage("employee-list")}
          >
            Employee List
          </button>

          <button
            style={sidebarBtnStyle(activePage === "contact-settings")}
            onClick={() => setActivePage("contact-settings")}
          >
            Edit Contact Page
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
  padding: "7px 15px",
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
