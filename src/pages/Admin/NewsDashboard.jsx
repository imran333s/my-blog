import React, { useEffect, useState } from "react";
import axios from "axios";
import "./NewsDashboard.css";

const NewsDashboard = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const API_URL = process.env.REACT_APP_API_URL ;

  useEffect(() => {
    let isMounted = true;

    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        setError("");

        const token = localStorage.getItem("token");

        if (!token) {
          if (isMounted) {
            setError("Unauthorized. Please login again.");
            setLoading(false);
          }
          return;
        }

        const { data } = await axios.get(
          `${API_URL}/api/dashboard-stats`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (isMounted) {
          setStats(data || null);
        }
      } catch (err) {
        if (!isMounted) return;

        const errorMessage =
          err.response?.data?.message ||
          err.message ||
          "Failed to load dashboard data.";

        setError(errorMessage);
        setStats(null);

        // Auto logout if token expired
        if (err.response?.status === 401) {
          localStorage.removeItem("token");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchDashboardData();

    return () => {
      isMounted = false;
    };
  }, [API_URL]);

  /* -------------------- UI STATES -------------------- */

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

  if (!stats) {
    return (
      <div className="dashboard-container error-state">
        <p style={{ color: "red" }}>No dashboard data available</p>
      </div>
    );
  }

  /* -------------------- DASHBOARD DATA -------------------- */

  const boxes = [
    { title: "Total News", value: stats.totalNews || 0 },
    { title: "Active News", value: stats.activeNews || 0 },
    { title: "Inactive News", value: stats.inactiveNews || 0 },

    { title: "Total Categories", value: stats.totalCategories || 0 },
    { title: "Total Departments", value: stats.totalDepartments || 0 },

    { title: "Total Employees", value: stats.totalEmployees || 0 },
    { title: "Active Employees", value: stats.activeEmployees || 0 },
    { title: "Total Managers", value: stats.totalManagers || 0 },
    { title: "Total Admins", value: stats.totalAdmins || 0 },

    { title: "Inquiry Received", value: stats.totalMessages || 0 },
    {
      title: "Public Feedback Received",
      value: stats.totalPublicFeedback || 0,
    },
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
