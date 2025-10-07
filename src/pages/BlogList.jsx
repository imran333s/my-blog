import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../App.css";

// List of categories for the filter dropdown
const categories = ["All", "Sports", "Business", "Politics", "Entertainment"];

const AdminBlogList = () => {
  // State to store all blogs fetched from the backend
  const [blogs, setBlogs] = useState([]);

  // State to store blogs filtered by category
  const [filteredBlogs, setFilteredBlogs] = useState([]);

  // State to keep track of the selected category in the filter
  const [selectedCategory, setSelectedCategory] = useState("All");

  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL;

  // =========================
  // Fetch blogs from backend
  // =========================
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/blogs`);
        const reversed = res.data.reverse(); // Show last added blog first
        setBlogs(reversed);
        setFilteredBlogs(reversed); // Initially, show all blogs
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };
    fetchBlogs();
  }, [API_URL]);

  // =========================
  // Handle category filter change
  // =========================
  const handleFilterChange = (e) => {
    const category = e.target.value;
    setSelectedCategory(category);

    if (category === "All") {
      // Show all blogs
      setFilteredBlogs(blogs);
    } else {
      // Show blogs only from selected category
      setFilteredBlogs(blogs.filter((blog) => blog.category === category));
    }
  };

  // =========================
  // Navigate to edit blog page
  // =========================
  const handleEditClick = (id) => {
    navigate(`/edit-blog/${id}`);
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
      await axios.delete(`${API_URL}/api/blogs/${id}`,{
        headers: {
          Authorization: `Bearer ${token}`, // send JWT for authorization
        },
    });

      // Update the blogs after deletion
      const updatedBlogs = blogs.filter((blog) => blog._id !== id);
      setBlogs(updatedBlogs);
      setFilteredBlogs(
        selectedCategory === "All"
          ? updatedBlogs
          : updatedBlogs.filter((blog) => blog.category === selectedCategory)
      );

      Swal.fire({
        icon: "success",
        title: "Deleted!",
        text: "Blog has been deleted successfully.",
        timer: 2000,
        showConfirmButton: false,
      });
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
        {/* =========================
            Section Title
        ========================= */}
        <h2 className="section-title">News List</h2>

        {/* =========================
            Category Filter Dropdown
        ========================= */}
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

        {/* =========================
            Blogs Table
        ========================= */}
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
                <th>Status</th> {/* ✅ New Column */}
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
                    {blog.content.length > 100
                      ? blog.content.substring(0, 100) + "..."
                      : blog.content}
                  </td>
                  <td>{blog.category || "N/A"}</td>
                  <td>
                    {/* ✅ Show colored status */}
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
                  <td style={{ display: "flex", gap: "10px" }}>
                    <button
                      onClick={() => handleEditClick(blog._id)}
                      className="edit-btn small-btn"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(blog._id)}
                      className="delete-btn small-btn"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </main>
  );
};

export default AdminBlogList;
