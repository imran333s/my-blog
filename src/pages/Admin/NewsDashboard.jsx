import React, { useEffect, useState } from "react";
import axios from "axios";
import "./NewsDashboard.css";

const NewsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      setError("");

      try {
        const token = localStorage.getItem("token");

        const response = await axios.get(`${API_URL}/api/dashboard-stats`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Normalize error if API returns a message property
        if (response.data.message) {
          throw new Error(response.data.message);
        }

        setStats(response.data);
      } catch (err) {
        // Normalize all errors to a string
        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to load dashboard data.";
        setError(errorMessage);
        setStats(null);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [API_URL]);

  // Loading state
  if (loading) {
    return (
      <div className="dashboard-container loading-state">
        <div className="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="dashboard-container error-state">
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  // No data
  if (!stats) {
    return (
      <div className="dashboard-container error-state">
        <p style={{ color: "red" }}>No dashboard data available</p>
      </div>
    );
  }

  // Dashboard boxes

  const boxes = [
    // 📌 Content Performance
    { title: "Total News", value: stats.totalNews || 0 },
    { title: "Active News", value: stats.activeNews || 0 },
    { title: "Inactive News", value: stats.inactiveNews || 0 },

    // 📂 Structure
    { title: "Total Categories", value: stats.totalCategories || 0 },
    { title: "Total Departments", value: stats.totalDepartments || 0 },

    // 👥 Team / Users
    { title: "Total Employees", value: stats.totalEmployees || 0 },
    { title: "Active Employees", value: stats.activeEmployees || 0 },
    { title: "Total Managers", value: stats.totalManagers || 0 },
    { title: "Total Admins", value: stats.totalAdmins || 0 },

    // 📩 Engagement
    { title: "Inquiry Received", value: stats.totalMessages || 0 },
    {
      title: "Public Feedback Received",
      value: stats.totalPublicFeedback || 0,
    },
  ];

  // Debugging: log all box values
  boxes.forEach((box) => console.log(box.title, box.value, typeof box.value));
  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Admin Dashboard 📰</h2>

      <div className="dashboard-grid">
        {boxes.map((box, index) => (
          <div className="dashboard-box" key={index}>
            <h3>{box.title}</h3>
            <p>
              {box.value !== null && box.value !== undefined
                ? typeof box.value === "object"
                  ? JSON.stringify(box.value)
                  : box.value
                : 0}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsDashboard;
