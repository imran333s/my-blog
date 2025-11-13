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
  const [content, setContent] = useState("");
  const [videoLink, setVideoLink] = useState("");
  const [status, setStatus] = useState(null);

  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  const [subcategoryOptions, setSubcategoryOptions] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState(null);

  // ✅ Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/categories`);
        const activeCats = res.data.filter(
          (cat) => cat.status?.toLowerCase() === "active"
        );
        const formatted = activeCats.map((cat) => ({
          value: cat._id,
          label: cat.name,
        }));
        setCategoryOptions(formatted);
      } catch (err) {
        console.error("Error loading categories:", err);
        Swal.fire("Error", "Could not load categories", "error");
      }
    };
    fetchCategories();
  }, [API_URL]);

  // ✅ Fetch Subcategories (when a category is chosen)
  useEffect(() => {
    const fetchSubcategories = async () => {
      if (!selectedCategory) return;
      try {
        const res = await axios.get(
          `${API_URL}/api/subcategories?category=${selectedCategory.value}`
        );
        const formatted = res.data
          .filter((sub) => sub.status?.toLowerCase() === "active")
          .map((sub) => ({
            value: sub._id,
            label: sub.name,
          }));
        setSubcategoryOptions(formatted);
      } catch (err) {
        console.error("Error fetching subcategories:", err);
      }
    };
    fetchSubcategories();
  }, [selectedCategory, API_URL]);

  // ✅ Fetch Existing Blog Details
  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/blogs/${blogId}`);
        const blog = res.data;

        setTitle(blog.title || "");
        setImage(blog.image || "");
        setContent(blog.content || "");
        setVideoLink(blog.videoLink || "");
        setStatus(
          blog.status ? { value: blog.status, label: blog.status } : null
        );

        // Set existing category
        if (blog.category) {
          setSelectedCategory({
            value: blog.category._id,
            label: blog.category.name,
          });
        }

        // Set existing subcategory
        if (blog.subcategory) {
          setSelectedSubcategory({
            value: blog.subcategory._id,
            label: blog.subcategory.name,
          });
        }
      } catch (err) {
        console.error("Error fetching blog:", err);
      }
    };
    if (blogId) fetchBlog();
  }, [blogId, API_URL]);

  // ✅ Handle Submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedCategory)
      return Swal.fire("Warning", "Please select a category", "warning");

    const token = localStorage.getItem("token");
    if (!token) return Swal.fire("Error", "Not authorized", "error");

    try {
      await axios.put(
        `${API_URL}/api/blogs/${blogId}`,
        {
          title,
          image,
          content,
          videoLink,
          category: selectedCategory.value,
          subcategory: selectedSubcategory ? selectedSubcategory.value : null,
          status: status ? status.value : "Active",
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
      console.error("Update error:", err);
      Swal.fire("Error", "Could not update blog", "error");
    }
  };

  // ✅ Quill Toolbar Setup
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
            placeholder="Enter blog title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />

          <label>Image URL</label>
          <input
            type="text"
            placeholder="Enter image URL"
            value={image}
            onChange={(e) => setImage(e.target.value)}
          />

          <label>Video Link (YouTube)</label>
          <input
            type="text"
            placeholder="Enter YouTube video link"
            value={videoLink}
            onChange={(e) => setVideoLink(e.target.value)}
          />

          <label>Category</label>
          <Select
            options={categoryOptions}
            value={selectedCategory}
            onChange={(val) => {
              setSelectedCategory(val);
              setSelectedSubcategory(null);
            }}
            placeholder="Select category"
          />

          <label>Subcategory</label>
          <Select
            options={subcategoryOptions}
            value={selectedSubcategory}
            onChange={setSelectedSubcategory}
            placeholder={
              selectedCategory ? "Select subcategory" : "Select category first"
            }
            isDisabled={!selectedCategory}
          />

          <label>Status</label>
          <Select
            options={statusOptions}
            value={status}
            onChange={setStatus}
            placeholder="Select status"
          />

          <label>Content</label>
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            modules={modules}
            formats={formats}
            placeholder="Write or edit your content..."
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
