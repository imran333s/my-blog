import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import Select from "react-select";

const categoryOptions = [
  { value: "Home", label: "Home" },
  { value: "Sports", label: "Sports" },
  { value: "Business", label: "Business" },
  { value: "Politics", label: "Politics" },
  { value: "Entertainment", label: "Entertainment" },
];

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const EditBlog = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [description, setDescription] = useState("");
  const [categories, setCategories] = useState([]);
  const [status, setStatus] = useState(null);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/blogs/${id}`);
        setTitle(res.data.title || "");
        setImage(res.data.image || "");
        setDescription(res.data.content || "");

        if (res.data.category) {
          const catArray = res.data.category
            .split(",")
            .map((c) => ({ value: c.trim(), label: c.trim() }));
          setCategories(catArray);
        }

        if (res.data.status) {
          setStatus({ value: res.data.status, label: res.data.status });
        }
      } catch (err) {
        console.error("Failed to fetch blog:", err);
      }
    };
    fetchBlog();
  }, [id, API_URL]);

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
      await axios.put(
        `${API_URL}/api/blogs/${id}`,
        {
          title,
          image,
          content: description,
          category: categories.map((c) => c.value).join(", "),
          status: status ? status.value : "Active",
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      Swal.fire({
        icon: "success",
        title: "Edited!",
        text: "News has been updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      navigate("/admin/dashboard");
    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Failed!",
        text: "Could not update blog",
      });
    }
  };

  return (
    <div className="editblog-container">
      <h2 className="form-title">Edit News</h2>

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
          Save Changes
        </button>
      </form>

      {/* ✅ Inline CSS for responsive layout */}
      <style>{`
        .editblog-container {
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

export default EditBlog;
