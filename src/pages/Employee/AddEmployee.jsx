import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import Select from "react-select";
import api from "../../services/api"; // ✅ centralized api

const AddEmployee = () => {
  const [departments, setDepartments] = useState([]);

  const roleOptions = [
    { value: "admin", label: "Admin" },
    { value: "manager", label: "Manager" },
    { value: "employee", label: "Employee" },
  ];

  const [form, setForm] = useState({
    name: "",
    email: "",
    mobile: "",
    password: "",
    dob: "",
    role: { value: "employee", label: "Employee" },
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
      await api.post("/api/users/", {
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
        role: { value: "employee", label: "Employee" },
        startDate: "",
        department: "",
        customDepartment: "",
        reportingManager: "",
      });
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Error!",
        text:
          err.response?.data?.message ||
          "Failed to add employee. Make sure you have permission.",
      });
    }
  };

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await api.get("/api/departments");
        setDepartments(res.data);
      } catch (err) {
        console.error("Failed to load departments:", err);
      }
    };
    fetchDepartments();
  }, []);

  const styles = {
    container: {
      maxWidth: "900px",
      margin: "0 auto",
      padding: "25px",
      background: "#fff",
    },
    title: { fontSize: "1.7rem", fontWeight: "bold", marginBottom: "20px" },
    form: {
      display: "grid",
      gridTemplateColumns: "repeat(3, 1fr)",
      gap: "35px",
    },
    formGroup: { marginBottom: "18px" },
    input: {
      width: "100%",
      padding: "10px",
      border: "1px solid #ccc",
      borderRadius: "6px",
      fontSize: "1rem",
    },
    submitBtn: {
      padding: "12px 20px",
      background: "#007bff",
      border: "none",
      color: "white",
      fontSize: "1.1rem",
      borderRadius: "6px",
      marginTop: "10px",
      cursor: "pointer",
    },
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Add Employee</h2>
      <form onSubmit={handleSubmit} style={styles.form} autoComplete="off">
        <input type="text" name="fakeEmail" style={{ display: "none" }} />
        <input
          type="password"
          name="fakePassword"
          style={{ display: "none" }}
          autoComplete="new-password"
        />

        <div style={styles.formGroup}>
          <input
            type="text"
            name="name"
            placeholder="Full Name"
            style={styles.input}
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            style={styles.input}
            value={form.email}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <input
            type="password"
            name="password"
            placeholder="Password"
            style={styles.input}
            value={form.password}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <input
            type="text"
            name="mobile"
            placeholder="Mobile Number"
            style={styles.input}
            value={form.mobile}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <input
            type={form.dob ? "date" : "text"}
            name="dob"
            placeholder="Date of Birth"
            style={styles.input}
            value={form.dob}
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => !form.dob && (e.target.type = "text")}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <Select
            options={roleOptions}
            value={form.role}
            onChange={handleRoleChange}
            placeholder="Select Role..."
          />
        </div>

        <div style={styles.formGroup}>
          <input
            type={form.startDate ? "date" : "text"}
            name="startDate"
            placeholder="Start Date"
            style={styles.input}
            value={form.startDate}
            onFocus={(e) => (e.target.type = "date")}
            onBlur={(e) => !form.startDate && (e.target.type = "text")}
            onChange={handleChange}
            required
          />
        </div>

        <div style={styles.formGroup}>
          <select
            name="department"
            style={styles.input}
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
            <option value="Other">Other</option>
          </select>
        </div>

        {form.department === "Other" && (
          <div style={styles.formGroup}>
            <input
              type="text"
              name="customDepartment"
              placeholder="Enter Custom Department"
              style={styles.input}
              value={form.customDepartment}
              onChange={handleChange}
              required
            />
          </div>
        )}

        <div style={styles.formGroup}>
          <input
            type="text"
            name="reportingManager"
            placeholder="Reporting Manager"
            style={styles.input}
            value={form.reportingManager}
            onChange={handleChange}
          />
        </div>

        <button type="submit" style={styles.submitBtn}>
          Add Employee
        </button>
      </form>
    </div>
  );
};

export default AddEmployee;
