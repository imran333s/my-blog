import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Select from "react-select";

const AddEmployee = () => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [departments, setDepartments] = useState([]);

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
    customDepartment: "",
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

    const finalDepartment =
      form.department === "Other" ? form.customDepartment : form.department;

    try {
      await axios.post(`${API_URL}/api/employees/add`, {
        ...form,
        role: form.role.value,
        department: finalDepartment,
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
        customDepartment: "",
        reportingManager: "",
      });
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to add employee.",
      });
    }
  };

  useEffect(() => {
    axios.get(`${API_URL}/api/departments`).then((res) => {
      setDepartments(res.data);
    });
  }, []);

  return (
    <div className="addemployee-container">
      <h2 className="form-title">Add Employee</h2>

      <form
        onSubmit={handleSubmit}
        className="employee-form"
        autoComplete="off"
      >
        {/* STOP AUTOFILL */}
        <input type="text" name="fakeEmail" style={{ display: "none" }} />
        <input
          type="password"
          name="fakePassword"
          style={{ display: "none" }}
          autoComplete="new-password"
        />

        {/* NAME */}
        <div className="form-group">
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            className="form-input"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        {/* EMAIL */}
        <div className="form-group">
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="form-input"
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        {/* PASSWORD */}
        <div className="form-group">
          <input
            type="password"
            name="password"
            placeholder="Password"
            className="form-input"
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        {/* MOBILE */}
        <div className="form-group">
          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            className="form-input"
            value={form.mobile}
            onChange={handleChange}
            required
          />
        </div>

        {/* DOB */}
        <div className="form-group">
          <input
            type={form.dob ? "date" : "text"}
            name="dob"
            placeholder="Date of Birth"
            className="form-input"
            value={form.dob}
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => !form.dob && (e.target.type = "text")}
            onChange={handleChange}
            required
          />
        </div>

        {/* ROLE */}
        <div className="form-group select-wrapper">
          <Select
            options={roleOptions}
            value={form.role}
            onChange={handleRoleChange}
            placeholder="Select Role..."
          />
        </div>

        {/* START DATE */}
        <div className="form-group">
          <input
            type={form.startDate ? "date" : "text"}
            name="startDate"
            placeholder="Start Date"
            className="form-input"
            value={form.startDate}
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => !form.startDate && (e.target.type = "text")}
            onChange={handleChange}
            required
          />
        </div>

        {/* DEPARTMENT + OTHER OPTION */}
        <div className="form-group">
          <select
            name="department"
            className="form-input"
            value={form.department}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>

            {departments.map((d) => (
              <option key={d._id} value={d.name}>
                {d.name}
              </option>
            ))}

            {/* NEW OPTION */}
            <option value="Other">Other</option>
          </select>
        </div>

        {/* CUSTOM DEPARTMENT INPUT */}
        {form.department === "Other" && (
          <div className="form-group">
            <input
              type="text"
              name="customDepartment"
              placeholder="Enter Custom Department"
              className="form-input"
              value={form.customDepartment}
              onChange={handleChange}
              required
            />
          </div>
        )}

        {/* REPORTING MANAGER */}
        <div className="form-group">
          <input
            type="text"
            name="reportingManager"
            placeholder="Reporting Manager"
            className="form-input"
            value={form.reportingManager}
            onChange={handleChange}
          />
        </div>

        {/* SUBMIT */}
        <button type="submit" className="submit-btn">
          Add Employee
        </button>
      </form>

      {/* STYLES */}
      <style>{`
        .addemployee-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 25px;
          background: #fff;
        }

        .form-title {
          font-size: 1.7rem;
          font-weight: bold;
          margin-bottom: 20px;
        }

        .employee-form {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 35px;
        }

        .form-group {
          margin-bottom: 18px;
        }

        .form-input {
          width: 100%;
          padding: 10px;
          border: 1px solid #ccc;
          border-radius: 6px;
          font-size: 1rem;
        }

        .select-wrapper .css-yk16xz-control,
        .select-wrapper .css-1pahdxg-control {
          min-height: 42px !important;
          height: 42px !important;
        }

        .submit-btn {
          grid-column: span 3;
          padding: 12px;
          background: #007bff;
          border: none;
          color: white;
          font-size: 1.1rem;
          border-radius: 6px;
          margin-top: 10px;
          cursor: pointer;
          transition: .3s;
        }

        .submit-btn:hover {
          background: #0056b3;
        }

        @media (max-width: 900px) {
          .employee-form {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 600px) {
          .employee-form {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
};

export default AddEmployee;
