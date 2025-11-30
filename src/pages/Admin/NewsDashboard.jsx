import React, { useEffect, useState } from "react";
import axios from "axios";
import "./NewsDashboard.css";

const NewsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const token = localStorage.getItem("token");

        const response = await axios.get(
          `${API_URL}/api/admin/dashboard-stats`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        setStats(response.data);
      } catch (error) {
        console.error("Failed to fetch dashboard stats:", error);
        setError("Failed to load dashboard data. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [API_URL]);

  if (loading) {
    return (
      <div className="dashboard-container loading-state">
        <div className="spinner"></div>
        <p>Loading dashboard data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-container error-state">
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  }

  // ✅ Added Total Departments
  const boxes = [
    { title: "Total News", value: stats.totalNews },
    { title: "Total Categories", value: stats.totalCategories },
    { title: "Total Departments", value: stats.totalDepartments }, // NEW
    { title: "Total Employees", value: stats.totalEmployees },
    { title: "Active News", value: stats.activeNews },
    { title: "Inactive News", value: stats.inactiveNews },
    { title: "Inquiry Received", value: stats.totalMessages },
    { title: "Active Employees", value: stats.activeEmployees },
    { title: "Inactive Employees", value: stats.inactiveEmployees },
    { title: "Total Admins", value: stats.totalAdmins },
  ];

  return (
    <div className="dashboard-container">
      <h2 className="dashboard-title">Admin Dashboard 📰</h2>

      <div className="dashboard-grid">
        {boxes.map((box, index) => (
          <div className="dashboard-box" key={index}>
            <h3>{box.title}</h3>
            <p>{box.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsDashboard;
