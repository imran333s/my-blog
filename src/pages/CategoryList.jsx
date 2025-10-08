import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";

const CategoryList = () => {
  const [categories, setCategories] = useState([]);
  const API_URL = process.env.REACT_APP_API_URL;

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/categories`);
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to fetch categories", "error");
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Delete category
  const handleDelete = async (id) => {
    const token = localStorage.getItem("token");
    if (!token) return Swal.fire("Error", "You are not authorized", "error");

    try {
      await axios.delete(`${API_URL}/api/categories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      Swal.fire("Deleted!", "Category has been deleted.", "success");
      setCategories(categories.filter((cat) => cat._id !== id));
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to delete category", "error");
    }
  };

  return (
    <div>
      <h2 style={{ marginBottom: "20px", fontWeight: "bold" }}>
        Category List
      </h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr style={{ background: "#f0f0f0" }}>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Image</th>
            <th style={thStyle}>Caption</th>
            <th style={thStyle}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((cat) => (
            <tr key={cat._id}>
              <td style={tdStyle}>{cat.name}</td>
              <td style={tdStyle}>
                <img src={cat.image} alt={cat.name} width={60} />
              </td>
              <td style={tdStyle}>{cat.caption}</td>
              <td style={tdStyle}>
                <button
                  onClick={() => handleDelete(cat._id)}
                  style={{
                    padding: "5px 10px",
                    borderRadius: "5px",
                    border: "none",
                    background: "#dc3545",
                    color: "#fff",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// Table styles
const thStyle = { padding: "10px", border: "1px solid #ccc" };
const tdStyle = {
  padding: "10px",
  border: "1px solid #ccc",
  textAlign: "center",
};

export default CategoryList;
