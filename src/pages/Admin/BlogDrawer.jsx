import React from "react";
import "./BlogDrawer.css";

const BlogDrawer = ({ blog, onClose }) => {
  if (!blog) return null;

  return (
    <div className="drawer-overlay" onClick={onClose}>
      <div className="drawer" onClick={(e) => e.stopPropagation()}>
        <button className="drawer-close" onClick={onClose}>×</button>

        <h2>{blog.title}</h2>
        <p><strong>Category:</strong> {blog.category}</p>
        <p><strong>Status:</strong> {blog.status}</p>

        <hr />

        <div
          dangerouslySetInnerHTML={{ __html: blog.content }}
          style={{ marginTop: "15px" }}
        />
      </div>
    </div>
  );
};

export default BlogDrawer;
