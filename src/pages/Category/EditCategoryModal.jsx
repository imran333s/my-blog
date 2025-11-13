import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./EditCategory.css";

const EditCategoryModal = ({ isOpen, onClose, categoryId, onUpdated }) => {
  const API_URL = process.env.REACT_APP_API_URL;
  const [formData, setFormData] = useState({
    name: "",
    image: "",
    caption: "",
    status: "Active",
  });

  const [subcategories, setSubcategories] = useState([]);
  const [newSubcategory, setNewSubcategory] = useState("");

  useEffect(() => {
    if (!categoryId) return;

    const fetchData = async () => {
      try {
        const categoryRes = await axios.get(
          `${API_URL}/api/categories/${categoryId}`
        );
        const subRes = await axios.get(
          `${API_URL}/api/subcategories?category=${categoryId}`
        );

        setFormData({
          name: categoryRes.data.name || "",
          image: categoryRes.data.image || "",
          caption: categoryRes.data.caption || "",
          status: categoryRes.data.status || "Active",
        });

        setSubcategories(subRes.data || []);
      } catch (err) {
        console.error("Error fetching category/subcategories:", err);
        Swal.fire("Error", "Failed to load category data", "error");
      }
    };

    fetchData();
  }, [categoryId, API_URL]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Add new subcategory
  const handleAddSubcategory = async () => {
    if (!newSubcategory.trim()) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return Swal.fire("Error", "Not authorized", "error");

      const res = await axios.post(
        `${API_URL}/api/subcategories`,
        {
          name: newSubcategory.trim(),
          category: categoryId,
          status: "Active",
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // ✅ handle both response shapes
      const addedSub = res.data?.data || res.data;

      if (!addedSub || !addedSub.name) {
        throw new Error("Invalid response from server");
      }

      setSubcategories((prev) => [...prev, addedSub]);
      setNewSubcategory("");

      Swal.fire({
        icon: "success",
        title: "Added!",
        text: `${addedSub.name} subcategory added successfully.`,
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Add subcategory error:", error);
      Swal.fire("Error", "Failed to add subcategory", "error");
    }
  };

  // ✅ Delete subcategory
  const handleRemoveSubcategory = async (id, name) => {
    const confirm = await Swal.fire({
      title: `Delete "${name}"?`,
      text: "This action cannot be undone.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return Swal.fire("Error", "Not authorized", "error");

      await axios.delete(`${API_URL}/api/subcategories/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setSubcategories(subcategories.filter((s) => s._id !== id));

      Swal.fire("Deleted!", `${name} removed successfully.`, "success");
    } catch (error) {
      console.error("Delete subcategory error:", error);
      Swal.fire("Error", "Failed to delete subcategory", "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return Swal.fire("Error", "Not authorized", "error");

    try {
      await axios.put(`${API_URL}/api/categories/${categoryId}`, formData, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Category updated successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      onUpdated();
      onClose();
    } catch (err) {
      console.error("Update category error:", err);
      Swal.fire("Error", "Could not update category", "error");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2>Edit Category</h2>

        <form onSubmit={handleSubmit} className="category-form">
          <label>Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />

          <label>Image URL</label>
          <input
            type="text"
            name="image"
            value={formData.image}
            onChange={handleChange}
          />

          <label>Caption</label>
          <input
            type="text"
            name="caption"
            value={formData.caption}
            onChange={handleChange}
          />

          <label>Status</label>
          <select name="status" value={formData.status} onChange={handleChange}>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>

          <label>Subcategories</label>
          <div className="subcategory-list">
            {subcategories
              .filter(Boolean) // ✅ skip undefined/null
              .map((sub) => (
                <div key={sub._id || sub.name} className="subcategory-item">
                  <span>{sub.name}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveSubcategory(sub._id, sub.name)}
                  >
                    ×
                  </button>
                </div>
              ))}
          </div>

          <div className="subcategory-input">
            <input
              type="text"
              value={newSubcategory}
              onChange={(e) => setNewSubcategory(e.target.value)}
              placeholder="Add new subcategory"
            />
            <button type="button" onClick={handleAddSubcategory}>
              Add
            </button>
          </div>

          <button type="submit" className="save-btn">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditCategoryModal;
