import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const AddDepartment = () => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [name, setName] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await axios.post(
        `${API_URL}/api/departments/add`,
        { name },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Department Added!",
        text: "New Department added successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      setName("");
    } catch (err) {
      Swal.fire("Error", "Failed to add department", "error");
    }
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Add Department</h2>

      <form onSubmit={handleSubmit} style={styles.form}>
        <input
          type="text"
          placeholder="Department Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={styles.input}
        />

        <button type="submit" style={styles.button}>
          Add Department
        </button>
      </form>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: "500px",
    margin: "0 auto",
  },
  heading: {
    textAlign: "center",
    marginBottom: "20px",
    fontWeight: "bold",
  },
  form: {
    background: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  input: {
    padding: "12px",
    borderRadius: "6px",
    border: "1px solid #ccc",
    fontSize: "15px",
  },
  button: {
    background: "#007bff",
    color: "#fff",
    padding: "12px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: "bold",
  },
};

export default AddDepartment;
