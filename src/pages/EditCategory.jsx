import React, { useState, useEffect } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import { useParams, useNavigate } from "react-router-dom";
import Select from "react-select";
import "./EditCategory.css";

const EditCategory = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const [formData, setFormData] = useState({
    name: "",
    image: "",
    caption: "",
    status: "Active",
  });

  const [loading, setLoading] = useState(true);

  // Fetch existing category data
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/categories/${id}`);
        setFormData({
          name: res.data.name,
          image: res.data.image,
          caption: res.data.caption,
          status: res.data.status,
        });
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Failed to fetch category details", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchCategory();
  }, [id, API_URL]);

  // Update category handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) {
      return Swal.fire("Error", "You are not authorized", "error");
    }

    try {
      await axios.put(
        `${API_URL}/api/categories/${id}`,
        {
          name: formData.name,
          image: formData.image,
          caption: formData.caption,
          status: formData.status,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire("Success", "Category updated successfully!", "success");
      navigate("/admin/dashboard"); // redirect to list after update
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to update category", "error");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  if (loading) return <p>Loading...</p>;

  const statusOptions = [
    { value: "Active", label: "Active" },
    { value: "Inactive", label: "Inactive" },
  ];

  return (
    <div className="edit-category-container">
      <h2>Edit Category</h2>
      <form onSubmit={handleSubmit} className="edit-category-form">
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <label>Image URL:</label>
        <input
          type="text"
          name="image"
          value={formData.image}
          onChange={handleChange}
          required
        />

        <label>Caption:</label>
        <textarea
          name="caption"
          value={formData.caption}
          onChange={handleChange}
          required
        />

        <label>Status:</label>
        <Select
          options={statusOptions}
          value={statusOptions.find((opt) => opt.value === formData.status)}
          onChange={(selected) =>
            setFormData({ ...formData, status: selected.value })
          }
        />

        <button type="submit" className="update-btn">
          Update Category
        </button>
      </form>
    </div>
  );
};

export default EditCategory;
