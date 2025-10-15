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
  // const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [selectedSort, setSelectedSort] = useState(sortOptions[0]); // default newest
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 5; // You can adjust this number
  const [showCategory, setShowCategory] = useState(false);
  const [showStatus, setShowStatus] = useState(false);

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

  // // ✅ Fetch blogs
  // const fetchBlogs = async () => {
  //   try {
  //     const res = await axios.get(`${API_URL}/api/blogs`);
  //     const reversed = res.data.reverse();
  //     setBlogs(reversed);
  //     setFilteredBlogs(reversed);
  //   } catch (err) {
  //     console.error("Error fetching blogs:", err);
  //   }
  // };

  // ✅ Initial load
  useEffect(() => {
    fetchCategories();
    fetchFilteredBlogs();
  }, [API_URL]);

  const fetchFilteredBlogs = async () => {
    try {
      const token = localStorage.getItem("token");
      const categories = selectedCategories.map((c) => c.value).join(",");
      const status = selectedStatus?.value || "";
      const sort = selectedSort?.value || "newest";

      const res = await axios.get(`${API_URL}/api/admin/blogs`, {
        params: { categories, status, sort },
        headers: { Authorization: `Bearer ${token}` }, // <-- add token
      });

      setFilteredBlogs(res.data);
      setCurrentPage(1);
    } catch (err) {
      console.error("Error fetching filtered blogs:", err);
      Swal.fire("Error", "Could not load blogs", "error");
    }
  };

  // Fetch filtered blogs whenever category, status, or sort changes
  useEffect(() => {
    fetchFilteredBlogs();
  }, [selectedCategories, selectedStatus, selectedSort]);

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

      await fetchFilteredBlogs();
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Error!",
        text: "Failed to delete blog.",
      });
      console.error("Error deleting blog:", err.response || err);
    }
  };

  const convertToEmbedURL = (url) => {
  if (!url) return "";

  let youtubeMatch = url.match(
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]+)/
  );
  if (youtubeMatch) {
    return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&mute=1`;

  }

  let vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
  if (vimeoMatch) {
    return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1`;

  }

  return url;
};



  return (
    <main className="main-content">
      <div className="container">
        <h2 className="section-title">News List</h2>

        <div className="filters-wrapper">
          {/* Left: Category + Status */}
          <div className="filters-left">
            {/* Category Box */}
            <div className="filter-box">
              <div onClick={() => setShowCategory(!showCategory)}>
                CATEGORIES ▾
              </div>
              {showCategory && (
                <div className="filter-options">
                  {categoryOptions.map((cat) => (
                    <div key={cat.value}>
                      <input
                        type="checkbox"
                        id={`cat-${cat.value}`}
                        value={cat.value}
                        checked={selectedCategories.some(
                          (c) => c.value === cat.value
                        )}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedCategories([...selectedCategories, cat]);
                          } else {
                            setSelectedCategories(
                              selectedCategories.filter(
                                (c) => c.value !== cat.value
                              )
                            );
                          }
                        }}
                      />
                      <label htmlFor={`cat-${cat.value}`}>{cat.label}</label>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Status Box */}
            <div className="filter-box">
              <div onClick={() => setShowStatus(!showStatus)}>STATUS ▾</div>
              {showStatus && (
                <div className="filter-options">
                  {statusOptions
                    .filter((s) => s.value !== "All")
                    .map((status) => (
                      <div key={status.value}>
                        <input
                          type="checkbox"
                          id={`status-${status.value}`}
                          value={status.value}
                          checked={selectedStatus?.value === status.value}
                          onChange={(e) => {
                            setSelectedStatus(e.target.checked ? status : null);
                          }}
                        />
                        <label htmlFor={`status-${status.value}`}>
                          {status.label}
                        </label>
                      </div>
                    ))}
                </div>
              )}
            </div>
          </div>
          {/* Sort Box */}
          <div className="sort-box">
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
              placeholder="Sort by: newest/oldest"
              isSearchable={false} // optional: remove search bar
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
                <th>S.No</th>
                <th>Image</th>
                <th>Video</th>
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
                .map((blog, index) => (
                  <tr key={blog._id}>
                    {/* S.No */}
                    <td>{(currentPage - 1) * blogsPerPage + index + 1}</td>

                    {/* Image */}
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

                    {/* Video Column */}
                    <td>
                      {blog.videoLink ? (
                        <iframe
                          src={convertToEmbedURL(blog.videoLink)}
                          width="120"
                          height="60"
                          frameBorder="0"
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                          title="Blog Video"
                        ></iframe>
                      ) : (
                        "No Video"
                      )}
                    </td>

                    {/* Remaining columns */}
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
            onUpdate={fetchFilteredBlogs}
          />
        )}
      </div>
    </main>
  );
};

export default AdminBlogList;
