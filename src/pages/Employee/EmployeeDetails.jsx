import React, { useEffect, useState } from "react";
import axios from "axios";
import "./EmployeeDetails.css";

const EmployeeDetails = ({ employeeId, isOpen, onClose }) => {
  const [employee, setEmployee] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    if (!employeeId) return;
    const fetchEmployee = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/employees/${employeeId}`);
        setEmployee(res.data);
      } catch (err) {
        console.error("Error fetching employee details:", err);
      }
    };
    fetchEmployee();
  }, [employeeId, API_URL]);

  return (
    <div className={`drawer-overlay ${isOpen ? "open" : ""}`} onClick={onClose}>
      <div
        className={`drawer ${isOpen ? "slide-in" : ""}`}
        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
      >
        <div className="drawer-header">
          <h2>Employee Details</h2>
          <button className="close-btn" onClick={onClose}>
            ✕
          </button>
        </div>

        {!employee ? (
          <p style={{ textAlign: "center" }}>Loading employee details...</p>
        ) : (
          <div className="drawer-content">
            <div className="employee-card">
              <p>
                <strong>Name:</strong> {employee.name}
              </p>
              <p>
                <strong>Email:</strong> {employee.email}
              </p>
              <p>
                <strong>Mobile:</strong> {employee.mobile}
              </p>
              <p>
                <strong>Date of Birth:</strong>{" "}
                {employee.dob?.split("T")[0] || "N/A"}
              </p>
              <p>
                <strong>Role:</strong> {employee.role}
              </p>
              <p>
                <strong>Department:</strong> {employee.department}
              </p>
              <p>
                <strong>Reporting Manager:</strong>{" "}
                {employee.reportingManager || "N/A"}
              </p>
              <p>
                <strong>Start Date:</strong>{" "}
                {employee.startDate?.split("T")[0] || "N/A"}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployeeDetails;
