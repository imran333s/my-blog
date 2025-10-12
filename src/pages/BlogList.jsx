import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import "./BlogList.css";
import EditBlogModal from "./EditBlog"; // adjust path if needed

// List of categories for the filter dropdown
const categories = ["All", "Sports", "Business", "Politics", "Entertainment"];

const AdminBlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [editingBlogId, setEditingBlogId] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  // =========================
  // Fetch blogs from backend
  // =========================
  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/blogs`);
      const reversed = res.data.reverse(); // Show last added blog first
      setBlogs(reversed);
      setFilteredBlogs(
        selectedCategory === "All"
          ? reversed
          : reversed.filter((b) => b.category === selectedCategory)
      );
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, [API_URL, selectedCategory]);

  // =========================
  // Prevent background scroll when modal is open
  // =========================
  useEffect(() => {
    if (editingBlogId) {
      document.body.style.overflow = "hidden"; // stop page scroll
    } else {
      document.body.style.overflow = "auto"; // restore page scroll
    }

    return () => {
      document.body.style.overflow = "auto"; // cleanup on unmount
    };
  }, [editingBlogId]);

  // =========================
  // Handle category filter change
  // =========================
  const handleFilterChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);

    if (category === "All") {
      setFilteredBlogs(blogs);
    } else {
      setFilteredBlogs(blogs.filter((blog) => blog.category === category));
    }
  };

  // =========================
  // View a blog's details
  // =========================
  const handleViewClick = (id) => {
    window.location.href = `/blog/${id}`; // simple navigation
  };

  // =========================
  // Delete a blog
  // =========================
  const handleDeleteClick = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    });

    if (!confirm.isConfirmed) return;

    const token = localStorage.getItem("token");
    try {
      await axios.delete(`${API_URL}/api/blogs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Blog has been deleted successfully.",
        timer: 2000,
        showConfirmButton: false,
      });

      fetchBlogs();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to delete blog.",
      });
      console.error("Error deleting blog:", err.response || err);
    }
  };

  return (
    <main className="main-content">
      <div className="container">
        {/* Section Title */}
        <h2 className="section-title">News List</h2>

        {/* Category Filter Dropdown */}
        <div style={{ marginBottom: "20px", marginLeft: "300px" }}>
          <label
            htmlFor="categoryFilter"
            style={{ marginRight: "10px", fontWeight: "bold" }}
          >
            Filter :
          </label>
          <select
            id="categoryFilter"
            value={selectedCategory}
            onChange={handleFilterChange}
            style={{ padding: "5px 10px", borderRadius: "4px" }}
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Blogs Table */}
        {filteredBlogs.length === 0 ? (
          <p>No blogs found.</p>
        ) : (
          <table className="admin-blog-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Content</th>
                <th>Category</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBlogs.map((blog) => (
                <tr key={blog._id}>
                  <td>
                    {blog.image ? (
                      <img
                        src={blog.image}
                        alt={blog.title}
                        style={{
                          width: "80px",
                          height: "60px",
                          objectFit: "cover",
                        }}
                      />
                    ) : (
                      "No Image"
                    )}
                  </td>
                  <td>{blog.title}</td>
                  <td>
                    <div
                      dangerouslySetInnerHTML={{
                        __html:
                          blog.content.length > 100
                            ? blog.content.substring(0, 100) + "..."
                            : blog.content,
                      }}
                      style={{ maxHeight: "60px", overflow: "hidden" }} // optional: limit height
                    />
                  </td>

                  <td>{blog.category || "N/A"}</td>
                  <td>
                    <span
                      style={{
                        color:
                          blog.status?.trim().toLowerCase() === "active"
                            ? "green"
                            : "red",
                        fontWeight: "bold",
                      }}
                    >
                      {blog.status}
                    </span>
                  </td>
                  <td className="action-buttons">
                    <div className="top-row">
                      <button
                        onClick={() => handleViewClick(blog._id)}
                        className="view-btn small-btn"
                        title="View Details"
                      >
                        👁️
                      </button>
                      <button
                        onClick={() => setEditingBlogId(blog._id)}
                        className="edit-btn small-btn"
                      >
                        ✏️
                      </button>
                    </div>
                    <div className="bottom-row">
                      <button
                        onClick={() => handleDeleteClick(blog._id)}
                        className="delete-btn small-btn"
                      >
                        🗑️
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ================= Edit Blog Modal ================= */}
        {editingBlogId && (
          <EditBlogModal
            blogId={editingBlogId}
            onClose={() => setEditingBlogId(null)}
            onUpdate={fetchBlogs}
          />
        )}
      </div>
    </main>
  );
};

export default AdminBlogList;
