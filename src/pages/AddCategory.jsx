import React, { useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Select from "react-select";

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const AddCategory = () => {
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  const [caption, setCaption] = useState("");
  const [status, setStatus] = useState({ value: "Active", label: "Active" });
  const API_URL = process.env.REACT_APP_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      return Swal.fire("Error", "You are not authorized", "error");
    }

    try {
      await axios.post(
        `${API_URL}/api/categories`,
        {
          name,
          image,
          caption,
          status: status ? status.value : "Active", // ✅ Include status
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Category Added!",
        text: "New category has been saved successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      // Reset form
      setName("");
      setImage("");
      setCaption("");
      setStatus(null);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to add category", "error");
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2 style={{ marginBottom: "20px", fontWeight: "bold" }}>Add Category</h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "12px",
          background: "#fff",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
        }}
      >
        <input
          type="text"
          placeholder="Category Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          required
          style={inputStyle}
        />

        <input
          type="text"
          placeholder="Caption"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          required
          style={inputStyle}
        />

        {/* ✅ Status Dropdown */}
        <div>
          <Select
            options={statusOptions}
            value={status}
            onChange={setStatus}
            placeholder="Select status..."
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#007bff",
            color: "#fff",
            padding: "10px",
            borderRadius: "6px",
            border: "none",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
          Save Category
        </button>
      </form>
    </div>
  );
};

// Input field style
const inputStyle = {
  padding: "10px",
  border: "1px solid #ccc",
  borderRadius: "6px",
  fontSize: "15px",
};

export default AddCategory;
