import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Select from "react-select";
import api from "../../services/api"; // ✅ centralized api
import "./EditEmployee.css";

const EditEmployeeModal = ({ employeeId, isOpen, onClose, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    mobile: "",
    dob: "",
    role: "",
    startDate: "",
    department: "",
    reportingManager: "",
  });

  const [loading, setLoading] = useState(true);

  const roleOptions = [
    { value: "Admin", label: "Admin" },
    { value: "Manager", label: "Manager" },
    { value: "Employee", label: "Employee" },
  ];

  // Fetch employee details
  useEffect(() => {
    if (!isOpen || !employeeId) return;

    const fetchEmployee = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/api/users/${employeeId}`);
        const data = res.data;

        setFormData({
          name: data.name || "",
          email: data.email || "",
          mobile: data.mobile || "",
          dob: data.dob ? data.dob.split("T")[0] : "",
          role: data.role || "",
          startDate: data.startDate ? data.startDate.split("T")[0] : "",
          department: data.department || "",
          reportingManager: data.reportingManager || "",
        });
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to fetch employee details", "error");
      } finally {
        setLoading(false);
      }
    };

    fetchEmployee();
  }, [employeeId, isOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (selected) => {
    setFormData({ ...formData, role: selected.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/users/${employeeId}`, formData);
      Swal.fire("Success", "Employee updated successfully!", "success");
      onUpdate && onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update employee", "error");
    }
  };

  if (!isOpen) return null;
  if (loading) return <p>Loading...</p>;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2>Edit Employee</h2>
        <form className="edit-employee-form" onSubmit={handleSubmit}>
          <label>Name:</label>
          <input name="name" value={formData.name} onChange={handleChange} required />

          <label>Email:</label>
          <input type="email" name="email" value={formData.email} onChange={handleChange} required />

          <label>Mobile:</label>
          <input name="mobile" value={formData.mobile} onChange={handleChange} required />

          <label>Date of Birth:</label>
          <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />

          <label>Role:</label>
          <Select
            options={roleOptions}
            value={roleOptions.find((opt) => opt.value === formData.role)}
            onChange={handleRoleChange}
          />

          <label>Start Date:</label>
          <input type="date" name="startDate" value={formData.startDate} onChange={handleChange} required />

          <label>Department:</label>
          <input name="department" value={formData.department} onChange={handleChange} required />

          <label>Reporting Manager:</label>
          <input name="reportingManager" value={formData.reportingManager} onChange={handleChange} />

          <button type="submit" className="update-employee-btn">
            Update Employee
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditEmployeeModal;
