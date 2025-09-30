import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import "../App.css";

const AdminBlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const navigate = useNavigate();
  const API_URL = process.env.REACT_APP_API_URL; // Use environment variable

  // Fetch blogs from backend
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/blogs`);
        setBlogs(res.data);
      } catch (err) {
        console.error("Error fetching blogs:", err);
      }
    };
    fetchBlogs();
  }, [API_URL]);

  // Handle edit click
  const handleEditClick = (id) => {
    navigate(`/edit-blog/${id}`);
  };

  // Handle delete click
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

    try {
      await axios.delete(`${API_URL}/api/blogs/${id}`);
      setBlogs(blogs.filter((blog) => blog._id !== id));

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
        <h2 className="section-title">All Blogs</h2>

        {blogs.length === 0 ? (
          <p>No blogs found.</p>
        ) : (
          <table className="admin-blog-table">
            <thead>
              <tr>
                <th>Image</th>
                <th>Title</th>
                <th>Content</th>
                <th>Category</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
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
