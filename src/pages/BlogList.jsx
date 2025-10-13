import React, { useEffect, useState } from "react";
import axios from "axios";
import Swal from "sweetalert2";
import Select from "react-select";
import "./BlogList.css";
import EditBlogModal from "./EditBlog";

const statusOptions = [
  { value: "All", label: "All" },
  { value: "Active", label: "Active" },
  { value: "Inactive", label: "Inactive" },
];
const sortOptions = [
  { value: "newest", label: "Newest" },
  { value: "oldest", label: "Oldest" },
];

const AdminBlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [selectedSort, setSelectedSort] = useState(sortOptions[0]); // default newest
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5; // You can adjust this number

  const API_URL = process.env.REACT_APP_API_URL;

  // ✅ Fetch only active categories
  const fetchCategories = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/categories`);
      const activeCategories = res.data.filter(
        (cat) => cat.status?.trim().toLowerCase() === "active"
      );
      const formatted = activeCategories.map((cat) => ({
        value: cat.name,
        label: cat.name,
      }));
      setCategoryOptions(formatted);
    } catch (err) {
      console.error("Error fetching categories:", err);
      Swal.fire("Error", "Could not load categories", "error");
    }
  };

  // ✅ Fetch blogs
  const fetchBlogs = async () => {
    try {
      const res = await axios.get(`${API_URL}/api/blogs`);
      const reversed = res.data.reverse();
      setBlogs(reversed);
      setFilteredBlogs(reversed);
    } catch (err) {
      console.error("Error fetching blogs:", err);
    }
  };

  // ✅ Initial load
  useEffect(() => {
    fetchBlogs();
    fetchCategories();
  }, [API_URL]);

  // ✅ Apply filters dynamically
  useEffect(() => {
    let filtered = [...blogs];
    // Filter by selected categories
    if (selectedCategories.length > 0) {
      const selectedCatValues = selectedCategories.map((c) =>
        c.value.toLowerCase()
      );
      filtered = filtered.filter((blog) =>
        selectedCatValues.includes(blog.category?.toLowerCase())
      );
    }
    // Filter by status (only if selected)
    if (selectedStatus && selectedStatus.value !== "All") {
      filtered = filtered.filter(
        (blog) =>
          blog.status?.toLowerCase() === selectedStatus.value.toLowerCase()
      );
    }
    // Sort blogs
    if (selectedSort?.value === "newest") {
      filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (selectedSort?.value === "oldest") {
      filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }
    // ✅ Reset to first page whenever filters or sorting change
    setCurrentPage(1);
    setFilteredBlogs(filtered);
  }, [selectedCategories, selectedStatus, blogs, selectedSort]);

  // ✅ Prevent background scroll when modal open
  useEffect(() => {
    document.body.style.overflow = editingBlogId ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [editingBlogId]);

  // ✅ Delete blog
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
        <h2 className="section-title">News List</h2>

        {/* =========================
            Category & Status Filters
        ========================== */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between", // pushes filters left and sort right
            alignItems: "center",
            marginBottom: "25px",
            flexWrap: "wrap", // optional for smaller screens
            gap: "20px", // spacing between items
          }}
        >
          {/* Left: Filters */}
          <div style={{ display: "flex", gap: "15px", flexWrap: "wrap" }}>
            {/* Category Filter */}
            <div style={{ minWidth: "220px", width: "220px" }}>
              <label
                style={{
                  fontWeight: "bold",
                  marginBottom: "5px",
                  display: "block",
                }}
              >
                Filter :
              </label>
              <Select
                options={categoryOptions}
                isMulti
                value={selectedCategories}
                onChange={(selected) => {
                  setSelectedCategories(selected);
                  setSelectedStatus(null); // Reset status on new category selection
                }}
                placeholder="Select categories..."
                isLoading={categoryOptions.length === 0}
              />
            </div>

            {/* Status Filter — shows only after categories selected */}
            {selectedCategories.length > 0 && (
              <div style={{ minWidth: "220px", width: "220px" }}>
                <label
                  style={{
                    fontWeight: "bold",
                    marginBottom: "5px",
                    display: "block",
                  }}
                >
                  Status :
                </label>
                <Select
                  options={statusOptions}
                  value={selectedStatus}
                  onChange={setSelectedStatus}
                  placeholder="Select status..."
                />
              </div>
            )}
          </div>

          {/* Right: Sort Dropdown */}
          <div style={{ minWidth: "220px", width: "220px" }}>
            <label
              style={{
                fontWeight: "bold",
                marginBottom: "5px",
                display: "block",
              }}
            >
              Sort by :
            </label>
            <Select
              options={sortOptions}
              value={selectedSort}
              onChange={setSelectedSort}
              placeholder="Select sort..."
            />
          </div>
        </div>

        {/* =========================
            Blogs Table
        ========================== */}
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
              {filteredBlogs
                .slice(
                  (currentPage - 1) * blogsPerPage,
                  currentPage * blogsPerPage
                )
                .map((blog) => (
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
                        style={{ maxHeight: "60px", overflow: "hidden" }}
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
                      <button
                        onClick={() =>
                          (window.location.href = `/blog/${blog._id}`)
                        }
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
                      <button
                        onClick={() => handleDeleteClick(blog._id)}
                        className="delete-btn small-btn"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        )}

        {/* =========================
    Pagination Controls
========================= */}
        {filteredBlogs.length > 0 && (
          <div className="pagination-container">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="pagination-btn"
            >
              ◀ Prev
            </button>

            {Array.from(
              { length: Math.ceil(filteredBlogs.length / blogsPerPage) },
              (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`pagination-btn ${
                    currentPage === i + 1 ? "active-page" : ""
                  }`}
                >
                  {i + 1}
                </button>
              )
            )}

            <button
              onClick={() =>
                setCurrentPage((prev) =>
                  Math.min(
                    prev + 1,
                    Math.ceil(filteredBlogs.length / blogsPerPage)
                  )
                )
              }
              disabled={
                currentPage === Math.ceil(filteredBlogs.length / blogsPerPage)
              }
              className="pagination-btn"
            >
              Next ▶
            </button>
          </div>
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
