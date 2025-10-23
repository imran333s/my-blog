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

  // === FRONTEND PAGINATION ===
  const totalPages = Math.ceil(blogs.length / blogsPerPage) || 1;

  // Clamp currentPage if blogs change
  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [blogs, totalPages, currentPage]);

  const currentBlogs = blogs.slice(
    (currentPage - 1) * blogsPerPage,
    currentPage * blogsPerPage
  );
// 🔹 Debug logs
console.log("Current page:", currentPage);
console.log("Current blogs slice:", currentBlogs.length, currentBlogs);
  // === DELETE BLOG ===
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

  // Prevent background scroll when modal open
  useEffect(() => {
    document.body.style.overflow = editingBlogId ? "hidden" : "auto";
    return () => (document.body.style.overflow = "auto");
  }, [editingBlogId]);

  return (
    <main className="main-content">
      <div className="container">
        <h2 className="section-title">News List</h2>

        <BlogFilters
          categoryOptions={categories}
          selectedCategories={selectedCategories}
          setSelectedCategories={(cats) => {
            setSelectedCategories(cats);
            setCurrentPage(1); // reset page
          }}
          selectedStatus={selectedStatus}
          setSelectedStatus={(status) => {
            setSelectedStatus(status);
            setCurrentPage(1); // reset page
          }}
          selectedSort={selectedSort}
          setSelectedSort={(sort) => {
            setSelectedSort(sort);
            setCurrentPage(1); // reset page
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
              convertToEmbedURL={convertToEmbedURL}
            />

            <BlogPagination
              blogs={blogs} // pass full blogs array
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
      </div>
    </main>
  );
};

export default AdminBlogList;
