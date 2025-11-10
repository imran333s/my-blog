import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { BlogFilters } from "./BlogFilters";
import { BlogTable } from "./BlogTable";
import { BlogPagination } from "./BlogPagination";
import EditBlogModal from "./EditBlog";
import { useBlogs } from "../../hooks/useBlogs";
import { deleteBlog } from "../../services/blogService";
import { useFetchCategories } from "../../hooks/useFetchCategories";

const blogsPerPage = 5;

const AdminBlogList = () => {
  const categories = useFetchCategories();

  const [selectedCategories, setSelectedCategories] = useState([]);
  const [selectedStatus, setSelectedStatus] = useState(null);
  const [selectedSort, setSelectedSort] = useState({
    value: "newest",
    label: "Newest",
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [editingBlogId, setEditingBlogId] = useState(null);
  const [viewBlog, setViewBlog] = useState(null); // ✅ View State

  const filters = {
    categories: selectedCategories.length
      ? selectedCategories.map((c) => c.value)
      : undefined,
    status:
      selectedStatus?.value && selectedStatus.value !== "All"
        ? selectedStatus.value
        : undefined,
    sort: selectedSort?.value || "newest",
  };

  const { blogs, loading, error, reload } = useBlogs(filters);

  const totalPages = Math.ceil(blogs.length / blogsPerPage) || 1;

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [blogs, totalPages, currentPage]);

  const currentBlogs = blogs.slice(
    (currentPage - 1) * blogsPerPage,
    currentPage * blogsPerPage
  );
  console.log("Blogs in table:", currentBlogs);
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "This news will be permanently deleted!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete it!",
    });

    if (result.isConfirmed) {
      try {
        await deleteBlog(id);
        reload();
        Swal.fire("Deleted!", "News has been deleted.", "success");
      } catch (err) {
        console.error(err);
        Swal.fire("Error!", "Failed to delete blog.", "error");
      }
    }
  };

  const convertToEmbedURL = (url) => {
    if (!url) return "";
    const yt = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]+)/
    );
    if (yt) return `https://www.youtube.com/embed/${yt[1]}?autoplay=1&mute=1`;
    const vm = url.match(/vimeo\.com\/(\d+)/);
    if (vm) return `https://player.vimeo.com/video/${vm[1]}?autoplay=1&muted=1`;
    return url;
  };

  useEffect(() => {
    document.body.style.overflow =
      editingBlogId || viewBlog ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [editingBlogId, viewBlog]);

  return (
    <main className="main-content">
      <div className="container">
        <h2 className="section-title">News List</h2>

        <BlogFilters
          categoryOptions={categories}
          selectedCategories={selectedCategories}
          setSelectedCategories={(cats) => {
            setSelectedCategories(cats);
            setCurrentPage(1);
          }}
          selectedStatus={selectedStatus}
          setSelectedStatus={(status) => {
            setSelectedStatus(status);
            setCurrentPage(1);
          }}
          selectedSort={selectedSort}
          setSelectedSort={(sort) => {
            setSelectedSort(sort);
            setCurrentPage(1);
          }}
        />

        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p>{error}</p>
        ) : currentBlogs.length === 0 ? (
          <p>No blogs found</p>
        ) : (
          <>
            <BlogTable
              blogs={currentBlogs}
              currentPage={currentPage}
              blogsPerPage={blogsPerPage}
              onEdit={setEditingBlogId}
              onDelete={handleDelete}
              onView={(blog) => setViewBlog(blog)} // ✅ View Button
              convertToEmbedURL={convertToEmbedURL}
            />

            <BlogPagination
              blogs={blogs}
              currentPage={currentPage}
              perPage={blogsPerPage}
              setPage={setCurrentPage}
            />
          </>
        )}

        {editingBlogId && (
          <EditBlogModal
            blogId={editingBlogId}
            onClose={() => setEditingBlogId(null)}
            onUpdate={reload}
          />
        )}

        {/* ✅ Inline Blog Preview Modal */}
        {viewBlog && (
          <div
            style={{
              position: "fixed",
              inset: 0,
              background: "rgba(0,0,0,0.6)",
              backdropFilter: "blur(3px)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              zIndex: 2000,
            }}
            onClick={() => setViewBlog(null)}
          >
            <div
              style={{
                width: "90%",
                maxWidth: "700px",
                background: "#fff",
                borderRadius: "10px",
                padding: "20px",
                position: "relative",
                maxHeight: "90vh",
                overflowY: "auto",
              }}
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setViewBlog(null)}
                style={{
                  position: "absolute",
                  right: "12px",
                  top: "10px",
                  fontSize: "22px",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                }}
              >
                ×
              </button>

              <h2 style={{ marginBottom: "10px" }}>{viewBlog.title}</h2>

              {viewBlog.image && (
                <img
                  src={viewBlog.image}
                  alt=""
                  style={{
                    width: "100%",
                    maxHeight: "250px",
                    objectFit: "contain", // ← CHANGE THIS
                    borderRadius: "8px",
                    marginBottom: "15px",
                    background: "#000", // optional (makes black border look clean)
                    padding: "5px", // optional
                  }}
                />
              )}

              <div
                dangerouslySetInnerHTML={{ __html: viewBlog.content }}
                style={{ lineHeight: "1.6" }}
              />
            </div>
          </div>
        )}
      </div>
    </main>
  );
};

export default AdminBlogList;
