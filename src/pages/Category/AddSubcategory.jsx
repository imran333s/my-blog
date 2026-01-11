import React, { useEffect, useState } from "react";
import api from "../../services/api"; // ✅ Use your central api instance

const AddSubcategory = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [message, setMessage] = useState("");

  // Fetch all categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await api.get("/api/categories"); // ✅ use api instance
        setCategories(res.data);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load categories.");
      }
    };

    fetchCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategory || !subCategory) {
      setMessage("Please select category and enter subcategory.");
      return;
    }

    try {
      await api.post("/api/categories/add-subcategory", {
        categoryName: selectedCategory,
        subcategory: subCategory,
      });

      setMessage("✅ Subcategory added successfully!");
      setSubCategory("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="add-subcategory-container" style={{ padding: "20px" }}>
      <h2>Add Subcategory</h2>

      {message && <p style={{ color: message.startsWith("✅") ? "green" : "red" }}>{message}</p>}

      <form onSubmit={handleSubmit}>
        {/* Dropdown */}
        <label>Main Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          required
        >
          <option value="">-- Select Category --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>

        {/* Input */}
        <label>New Subcategory Name</label>
        <input
          type="text"
          placeholder="Enter new subcategory (Example: Badminton)"
          value={subCategory}
          onChange={(e) => setSubCategory(e.target.value)}
          required
        />

        <button type="submit" style={buttonStyle}>
          Add Subcategory
        </button>
      </form>
    </div>
  );
};

const buttonStyle = {
  marginTop: "10px",
  padding: "10px 16px",
  backgroundColor: "#007bff",
  color: "#fff",
  border: "none",
  borderRadius: "6px",
  cursor: "pointer",
  fontWeight: "bold",
};

export default AddSubcategory;
