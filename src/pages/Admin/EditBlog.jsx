import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import axios from "axios";
import Select from "react-select";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import "./EditBlog.css";

const statusOptions = [
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];

const EditBlogModal = ({ blogId, onClose, onUpdate }) => {
  const API_URL = process.env.REACT_APP_API_URL;

  const [title, setTitle] = useState("");
  const [image, setImage] = useState("");
  const [categories, setCategories] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [status, setStatus] = useState(null);
  const [content, setContent] = useState("");
  const [videoLink, setVideoLink] = useState("");

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/categories`);
        const activeCategories = res.data.filter(
          (cat) => cat.status?.toLowerCase() === "active"
        );
        const formatted = activeCategories.map((cat) => ({
          value: cat.name,
          label: cat.name,
        }));
        setCategoryOptions(formatted);
      } catch (err) {
        console.error(err);
        Swal.fire("Error", "Could not load categories", "error");
      }
    };
    fetchCategories();
  }, [API_URL]);

  // Fetch blog data
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/blogs/${blogId}`);
        setTitle(res.data.title || "");
        setImage(res.data.image || "");
        setContent(res.data.content || "");
        if (res.data.category) {
          setCategories(
            res.data.category
              .split(",")
              .map((c) => ({ value: c.trim(), label: c.trim() }))
          );
        }
        if (res.data.status) {
          setStatus({ value: res.data.status, label: res.data.status });
        }

        // ✅ Set video link
        if (res.data.videoLink) {
          setVideoLink(res.data.videoLink);
        }
      } catch (err) {
        console.error(err);
      }
    };
    if (blogId) fetchBlog();
  }, [blogId, API_URL]);

  // Submit handler
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
    if (!token) return Swal.fire("Error", "Not authorized", "error");

    try {
      await axios.put(
        `${API_URL}/api/blogs/${blogId}`,
        {
          title,
          image,
          content,
          category: categories.map((c) => c.value).join(", "),
          status: status ? status.value : "Active",
          videoLink,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      Swal.fire({
        icon: "success",
        title: "Updated!",
        text: "Blog updated successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      onUpdate();
      onClose();
    } catch (err) {
      console.error(err);
      Swal.fire("Error", "Could not update blog", "error");
    }
  };

  // Quill toolbar setup
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, false] }],
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      ["link", "image"],
      ["clean"],
    ],
  };

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "list",
    "bullet",
    "link",
    "image",
  ];

  return (
    <div className="modal-overlay">
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Edit Blog</h2>
          <button className="modal-close" onClick={onClose}>
            ×
          </button>
        </div>

        <form onSubmit={handleSubmit} className="blog-form">
          <label>Title</label>
          <input
            type="text"
            placeholder="Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Image URL</label>
          <input
            type="text"
            placeholder="Image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />

          <label>Video Link (YouTube)</label>
          <input
            type="text"
            placeholder="Video Link"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
          />

          <label>Category</label>
          <Select
            options={categoryOptions}
            isMulti
            value={categories}
            onChange={setCategories}
            placeholder="Select categories..."
          />

          <label>Status</label>
          <Select
            options={statusOptions}
            value={status}
            onChange={setStatus}
            placeholder="Select status..."
          />

          <label>Content</label>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            placeholder="Write or edit your content here..."
          />

          <div className="modal-buttons">
            <button type="submit">Save Changes</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditBlogModal;
