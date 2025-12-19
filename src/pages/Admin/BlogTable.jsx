import React from "react";
import "./BlogList.css";

export const BlogTable = ({
  blogs,
  currentPage,
  blogsPerPage,
  onEdit,
  onDelete,
  onView,
  convertToEmbedURL,
}) => {
  if (blogs.length === 0) return <p>No blogs found.</p>;

  return (
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
        {blogs.map((blog, index) => (
          <tr key={blog._id}>
            <td data-label="S.No">
              {(currentPage - 1) * blogsPerPage + index + 1}
            </td>

            <td data-label="Image">
              {blog.image ? (
                <img src={blog.image} alt={blog.title} className="blog-thumb" />
              ) : (
                "No Image"
              )}
            </td>

            <td data-label="Video">
              {blog.videoLink ? (
                <iframe
                  src={convertToEmbedURL(blog.videoLink)}
                  frameBorder="0"
                  allow="autoplay; encrypted-media"
                  allowFullScreen
                  title="Blog Video"
                />
              ) : (
                "No Video"
              )}
            </td>

            <td data-label="Title">{blog.title}</td>

            <td data-label="Content">
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

            <td data-label="Category">
              {blog.category?.name || "N/A"}
              {blog.subcategory?.name ? ` → ${blog.subcategory.name}` : ""}
            </td>

            <td data-label="Status">
              <span
                className={`status-label ${
                  blog.status?.trim().toLowerCase() === "active"
                    ? "status-active"
                    : "status-inactive"
                }`}
              >
                {blog.status}
              </span>
            </td>

            <td data-label="Actions">
              <button
                onClick={() => onView(blog)}
                className="view-btn small-btn"
              >
                👁️
              </button>

              <button
                onClick={() => onEdit(blog._id)}
                className="edit-btn small-btn"
              >
                ✏️
              </button>

              <button
                onClick={() => onDelete(blog._id)}
                className="delete-btn small-btn"
              >
                🗑️
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};
