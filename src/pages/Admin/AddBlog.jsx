import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Select from "react-select";
import { useFetchCategories } from "../../hooks/useFetchCategories";

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const AddBlog = () => {
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  // Form states
  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [status, setStatus] = useState({ value: "Active", label: "Active" });

  // Category/Subcategory states
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [subcategoryOptions, setSubcategoryOptions] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  // Fetch categories (custom hook)
  const categoryOptions = useFetchCategories();

  // 🟢 Handle Category Change → Fetch Subcategories
  const handleCategoryChange = async (cat) => {
    setSelectedCategory(cat);
    setSelectedSubcategory(null);
    setSubcategoryOptions([]);

    if (!cat) return;

    try {
      const res = await axios.get(
        `${API_URL}/api/subcategories?category=${cat.value}`
      );
      const subs = res.data.filter((s) => s.status === "Active");
      setSubcategoryOptions(subs.map((s) => ({ value: s._id, label: s.name })));
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Failed to load subcategories", "error");
    }
  };

  // 🟢 Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategory) {
      return Swal.fire("Select Category", "Please pick a category", "warning");
    }

    const token = localStorage.getItem("token");
    if (!token) return Swal.fire("Error", "Not authorized", "error");

    try {
      await axios.post(
        `${API_URL}/api/blogs`,
        {
          title,
          content: description,
          image,
          category: selectedCategory.value, // ObjectId
          subcategory: selectedSubcategory ? selectedSubcategory.value : "", // ObjectId
          status: status.value,
          videoLink,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Added!",
        text: "News added successfully.",
        timer: 1500,
        showConfirmButton: false,
      });

      // Reset form
      setTitle("");
      setImage("");
      setDescription("");
      setSelectedCategory(null);
      setSelectedSubcategory(null);
      setStatus({ value: "Active", label: "Active" });
      setVideoLink("");
      setSubcategoryOptions([]);

      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      Swal.fire("Failed", "Could not add news", "error");
    }
  };

  return (
    <div
      style={{
        maxWidth: "600px",
        margin: "10px auto",
        padding: "30px 10px",
        background: "#fff",
        borderRadius: "16px",
        boxShadow: "0 8px 25px rgba(0,0,0,0.1)",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          fontSize: "28px",
          fontWeight: "700",
          marginBottom: "25px",
          color: "#222",
        }}
      >
        Add News
      </h2>

      <form
        onSubmit={handleSubmit}
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "18px",
        }}
      >
        {/* Title */}
        <input
          type="text"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          style={{
            padding: "12px 16px",
            borderRadius: "10px",
            border: "1px solid #dcdcdc",
            background: "#fafafa",
            fontSize: "15px",
            outline: "none",
          }}
        />

        {/* Image */}
        <input
          type="text"
          placeholder="Image URL"
          value={image}
          onChange={(e) => setImage(e.target.value)}
          style={{
            padding: "12px 16px",
            borderRadius: "10px",
            border: "1px solid #dcdcdc",
            background: "#fafafa",
            fontSize: "15px",
          }}
        />

        {/* Category */}
        <div style={{ marginBottom: "5px" }}>
          <Select
            options={categoryOptions}
            value={selectedCategory}
            onChange={handleCategoryChange}
            placeholder="Select Category"
          />
        </div>

        {/* Subcategory */}
        <div style={{ marginBottom: "5px" }}>
          <Select
            options={subcategoryOptions}
            value={selectedSubcategory}
            onChange={setSelectedSubcategory}
            placeholder="Select Subcategory"
            isDisabled={subcategoryOptions.length === 0}
          />
        </div>

        {/* Status */}
        <div style={{ marginBottom: "5px" }}>
          <Select
            options={statusOptions}
            value={status}
            onChange={setStatus}
            placeholder="Select Status"
          />
        </div>

        {/* Video Link */}
        <input
          type="text"
          placeholder="Video Link (optional)"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
          style={{
            padding: "12px 16px",
            borderRadius: "10px",
            border: "1px solid #dcdcdc",
            background: "#fafafa",
            fontSize: "15px",
          }}
        />

        {/* Description */}
        <textarea
          placeholder="Description"
          rows="6"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          style={{
            padding: "12px 16px",
            borderRadius: "10px",
            border: "1px solid #dcdcdc",
            background: "#fafafa",
            fontSize: "15px",
            resize: "vertical",
          }}
        ></textarea>

        {/* Submit Button */}
     <button
  style={{
    padding: "10px 16px",
    backgroundColor: "#4a90e2",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    fontSize: "15px",
    fontWeight: "600",
    width: "fit-content",   // 👈 IMPORTANT
    cursor: "pointer",
    whiteSpace: "nowrap",   // 👈 Prevents stretching
  }}
  onClick={() => navigate("/add-news")}
>
  Add News
</button>


      </form>
    </div>
  );
};

export default AddBlog;
