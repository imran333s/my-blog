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
import AdminEditAboutSettings from "./AdminEditAboutSettings";
import ChangePassword from "../../components/ChangePassword";
import AddDepartment from "../Department/AddDepartment";
import DepartmentList from "../Department/DepartmentList";
import Loader from "../../components/Loader";
import EnquiryList from "./EnquiryList";
import PublicFeedbackList from "./PublicFeedbackList";

const AdminDashboard = ({ onLogout }) => {
  const [activePage, setActivePage] = useState(
    localStorage.getItem("activePage") || "dashboard"
  );
  const [userInfo, setUserInfo] = useState({ name: "", role: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [websiteName] = useState("News Pulse");
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  // Logout
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("activePage");
    if (onLogout) onLogout();
    // navigate("/");
  };

  // Save active page to localStorage
  useEffect(() => {
    localStorage.setItem("activePage", activePage);
  }, [activePage]);

  // Fetch logged-in user info
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/api/auth/me`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Normalize role to string
        setUserInfo({
          name: response.data.name || "",
          role: response.data.role ? response.data.role.toLowerCase() : "",
        });
        setError(""); // clear any previous error
      } catch (err) {
        console.error("Failed to fetch user info:", err);

        let message = "Failed to fetch user info";
        if (err.response?.data) {
          message =
            typeof err.response.data.message === "string"
              ? err.response.data.message
              : JSON.stringify(err.response.data);
        } else if (err.message) {
          message = err.message;
        }

        setError(message);
        setUserInfo({ name: "", role: "" });
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [API_URL]);

  // RBAC-based sidebar items
  const sidebarItems = [
    { key: "dashboard", label: "Dashboard", roles: ["admin", "manager"] },
    {
      key: "add-blog",
      label: "Add News",
      roles: ["admin", "employee", "manager"],
    },
    {
      key: "blog-list",
      label: "News List",
      roles: ["admin", "employee", "manager"],
    },
    { key: "add-category", label: "Add Category", roles: ["admin"] },
    {
      key: "category-list",
      label: "Category List",
      roles: ["admin", "manager"],
    },
    { key: "add-employee", label: "Add Employee", roles: ["admin"] },
    {
      key: "employee-list",
      label: "Employee List",
      roles: ["admin", "manager"],
    },
    { key: "add-department", label: "Add Department", roles: ["admin"] },
    {
      key: "department-list",
      label: "Department List",
      roles: ["admin", "manager"],
    },
    { key: "contact-settings", label: "Edit Contact Page", roles: ["admin"] },
    { key: "about-settings", label: "Edit About Page", roles: ["admin"] },
    {
      key: "change-password",
      label: "Change Password",
      roles: ["admin", "manager", "employee"],
    },
    { key: "enquiry-list", label: "Enquiries", roles: ["admin", "manager"] },
    {
      key: "public-feedback",
      label: "Public Feedback",
      roles: ["admin", "manager"],
    },
  ];

  // Render main content based on active page
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
      case "add-department":
        return <AddDepartment />;
      case "department-list":
        return <DepartmentList />;
      case "contact-settings":
        return <AdminEditContactSettings />;
      case "about-settings":
        return <AdminEditAboutSettings />;
      case "change-password":
        return <ChangePassword />;
      case "public-feedback":
        return <PublicFeedbackList />;

      case "enquiry-list":
        return <EnquiryList />;

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

  // if (loading) return <Loader text="Loading admin panel..." />;

  if (error)
    return (
      <div className="error-state">
        <p>{error}</p>
      </div>
    );

  return (
    <div
      style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
    >
      <AdminHeader
        adminName={userInfo.name || ""}
        role={userInfo.role || ""}
        onLogout={handleLogout}
        websiteName={websiteName}
      />

      <div style={{ display: "flex", flex: 1 }}>
        {/* Sidebar */}
        <aside
          style={{
            width: "220px",
            background: "#405e7cff",
            padding: "5px 10px",
            boxShadow: "2px 0 5px rgba(0,0,0,0.1)",
          }}
        >
          <h2 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
            Admin Panel
          </h2>

          {sidebarItems
            .filter((item) => item.roles.includes(userInfo.role))
            .map((item) => (
              <SidebarButton
                key={item.key}
                active={activePage === item.key}
                onClick={() => setActivePage(item.key)}
                label={item.label}
              />
            ))}
        </aside>

        {/* Main content */}
        <main style={{ flex: 1, padding: "20px" }}>{renderContent()}</main>
      </div>
    </div>
  );
};

// Sidebar button component
const SidebarButton = ({ active, onClick, label }) => (
  <button
    onClick={onClick}
    style={{
      display: "block",
      width: "100%",
      padding: "7px 15px",
      marginBottom: "15px",
      border: "none",
      borderRadius: "8px",
      background: active ? "linear-gradient(90deg, #79da84ff)" : "#374151",
      color: active ? "#1f2937" : "#e5e7eb",
      textAlign: "left",
      cursor: "pointer",
      fontWeight: 600,
      fontSize: "0.95rem",
      boxShadow: active
        ? "0 4px 12px rgba(160, 206, 99, 0.5)"
        : "0 2px 5px rgba(0,0,0,0.15)",
      transition: "all 0.3s ease",
    }}
  >
    {label}
  </button>
);

export default AdminDashboard;
