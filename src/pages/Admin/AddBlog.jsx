import React, { useState, useEffect } from "react";
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

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState({ value: "Active", label: "Active" });
  const [videoLink, setVideoLink] = useState(""); // ✅ New field

  // ✅ Fetch categories using custom hook
 const categoryOptions = useFetchCategories();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (categories.length === 0) {
      return Swal.fire({
        icon: "warning",
        title: "Select category",
        text: "Please select at least one category",
      });
    }

    const token = localStorage.getItem("token");
    if (!token) {
      return Swal.fire("Error", "You are not authorized", "error");
    }

    try {
      await axios.post(
        `${API_URL}/api/blogs`,
        {
          title,
          image,
          content: description,
          category: categories.map((c) => c.value).join(", "),
          status: status ? status.value : "Active",
          videoLink,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Added!",
        text: "News added successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Could not add blog",
      });
    }
  };

  return (
    <div className="addblog-container">
      <h2 className="form-title">Add News</h2>

      <form onSubmit={handleSubmit} className="blog-form">
        {/* Row 1: Title | Image | Category */}
        <input
          type="text"
          placeholder="Title"
          className="form-input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Image URL"
          className="form-input"
          value={image}
          onChange={(e) => setImage(e.target.value)}
        />

        <div className="select-container">
          <Select
            options={categoryOptions}
            isMulti
            value={categories}
            onChange={setCategories}
            placeholder="Select categories..."
            isLoading={categoryOptions.length === 0}
          />
        </div>

        {/* Row 2: Status */}
        <div className="select-container half-width">
          <Select
            options={statusOptions}
            value={status}
            onChange={setStatus}
            placeholder="Select status..."
          />
        </div>

         {/* ✅ New Video Link Field */}
        <input
          type="text"
          placeholder="Video Link (optional)"
          className="form-input"
          value={videoLink}
          onChange={(e) => setVideoLink(e.target.value)}
        />

        {/* Row 3: Description */}
        <textarea
          placeholder="Description"
          rows="6"
          className="form-textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        {/* Row 4: Submit Button */}
        <button type="submit" className="submit-btn">
          Add News
        </button>
      </form>

      {/* Inline CSS for Responsiveness */}
      <style>{`
        .addblog-container {
          max-width: 900px;
          margin: 0 auto;
          padding: 20px;
        }

        .form-title {
          font-size: 1.5rem;
          font-weight: bold;
          margin-bottom: 20px;
        }

        .blog-form {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
        }

        .form-input, .select-container, .form-textarea {
          flex: 1;
          min-width: 260px;
          padding: 8px;
          border: 1px solid #ccc;
          border-radius: 6px;
        }

        .form-textarea {
          flex-basis: 100%;
        }

        .half-width {
          flex: 0 0 45%;
        }

        .submit-btn {
          background-color: #007bff;
          color: white;
          border: none;
          padding: 10px 20px;
          border-radius: 6px;
          cursor: pointer;
          transition: background 0.3s ease;
        }

        .submit-btn:hover {
          background-color: #0056b3;
        }

        /* 📱 Mobile Responsive */
        @media (max-width: 768px) {
          .blog-form {
            flex-direction: column;
          }
          .form-input,
          .select-container,
          .form-textarea,
          .half-width {
            flex: 1 1 100%;
            min-width: 100%;
          }
          .submit-btn {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
};

export default AddBlog;
