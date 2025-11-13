import React, { useEffect, useState } from "react";
import axios from "axios";

const AddSubcategory = () => {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_API_URL}/api/categories`)
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => console.error(err));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategory || !subCategory) {
      setMessage("Please select category and enter subcategory.");
      return;
    }

    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/categories/add-subcategory`,
        {
          categoryName: selectedCategory,
          subcategory: subCategory,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setMessage("✅ Subcategory added successfully!");
      setSubCategory("");
    } catch (err) {
      setMessage(err.response?.data?.message || "Something went wrong.");
    }
  };

  return (
    <div className="add-subcategory-container" style={{ padding: "20px" }}>
      <h2>Add Subcategory</h2>

      {message && <p style={{ color: "green" }}>{message}</p>}

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

        <button type="submit">Add Subcategory</button>
      </form>
    </div>
  );
};

export default AddSubcategory;
