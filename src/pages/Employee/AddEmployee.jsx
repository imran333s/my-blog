import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Select from "react-select";

const AddEmployee = () => {
  const API_URL = process.env.REACT_APP_API_URL;

  // Hardcoded role options
  const roleOptions = [
    { value: "Admin", label: "Admin" },
    { value: "Manager", label: "Manager" },
    { value: "Employee", label: "Employee" },
  ];

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    dob: "",
    role: { value: "Employee", label: "Employee" },
    startDate: "",
    department: "",
    reportingManager: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (selectedOption) => {
    setForm({ ...form, role: selectedOption });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(`${API_URL}/api/employees/add`, {
        ...form,
        role: form.role.value,
      });

      Swal.fire({
        icon: "success",
        title: "Added!",
        text: "Employee added successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      setForm({
        name: "",
        email: "",
        mobile: "",
        password: "",
        dob: "",
        role: { value: "Employee", label: "Employee" },
        startDate: "",
        department: "",
        reportingManager: "",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to add employee.",
      });
    }
  };

  return (
    <div className="addemployee-container">
      <h2 className="form-title">Add Employee</h2>

      <form
        onSubmit={handleSubmit}
        className="employee-form"
        autoComplete="off"
      >
        {/* Input Fields */}
        <input
          type="text"
          name="name"
          placeholder="Full Name"
          className="form-input"
          value={form.name}
          onChange={handleChange}
          required
        />

        {/* ✅ Manually filled email and password fields (no autofill) */}
        <input
          type="email"
          name="email"
          placeholder="Email Address"
          className="form-input"
          value={form.email}
          onChange={handleChange}
          autoComplete="off"
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          className="form-input"
          value={form.password}
          onChange={handleChange}
          autoComplete="new-password"
          required
        />

        <input
          type="text"
          name="mobile"
          placeholder="Mobile Number"
          className="form-input"
          value={form.mobile}
          onChange={handleChange}
          required
        />

        {/* ✅ Custom Date Input with visible placeholder */}
        <div className="date-wrapper">
          <input
            type={form.dob ? "date" : "text"}
            name="dob"
            placeholder="Date of Birth"
            className="form-input"
            value={form.dob}
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => {
              if (!form.dob) e.target.type = "text";
            }}
            onChange={handleChange}
            required
          />
        </div>

        {/* Role Selector */}
        <div className="select-container half-width">
          <Select
            options={roleOptions}
            value={form.role}
            onChange={handleRoleChange}
            placeholder="Select Role..."
          />
        </div>

        {/* ✅ Custom Start Date Input with placeholder */}
        <div className="date-wrapper">
          <input
            type={form.startDate ? "date" : "text"}
            name="startDate"
            placeholder="Start Date"
            className="form-input"
            value={form.startDate}
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => {
              if (!form.startDate) e.target.type = "text";
            }}
            onChange={handleChange}
            required
          />
        </div>

        <input
          type="text"
          name="department"
          placeholder="Department"
          className="form-input"
          value={form.department}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="reportingManager"
          placeholder="Reporting Manager"
          className="form-input"
          value={form.reportingManager}
          onChange={handleChange}
        />

        <button type="submit" className="submit-btn">
          Add Employee
        </button>
      </form>

      {/* Inline Styling for AddEmployee */}
      <style>{`
        .addemployee-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
          background-color: #fff;
        }

        .form-title {
          font-size: 1.6rem;
          font-weight: bold;
          margin-bottom: 20px;
          color: #333;
        }

        .employee-form {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .form-input, .select-container {
          flex: 1;
          min-width: 260px;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 0.95rem;
        }

        .form-input::placeholder {
          color: #999;
        }

        .half-width {
          flex: 0 0 45%;
        }

        .submit-btn {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .submit-btn:hover {
          background-color: #0056b3;
        }

        /* 📱 Responsive Styles */
        @media (max-width: 768px) {
          .employee-form {
            flex-direction: column;
          }
          .form-input,
          .select-container,
          .half-width {
            flex: 1 1 100%;
            min-width: 100%;
          }
          .submit-btn {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default AddEmployee;
