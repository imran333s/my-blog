import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "./Blogs.css";

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch(`${API_URL}/api/blogs`);
        if (!response.ok)
          throw new Error(`Failed to fetch blogs: ${response.status}`);
        const data = await response.json();
        setBlogs(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, [API_URL]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (error)
    return <p style={{ textAlign: "center", color: "red" }}>Error: {error}</p>;

  const filteredBlogs = blogs.filter((blog) => blog.status === "Active");

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>News</h2>

      <div className="blog-grid">
        {filteredBlogs.map((blog) => (
          <div className="blog-card" key={blog._id}>
            {blog.image ? (
              <div style={{ marginBottom: "7px" }}>
                <img
                  src={blog.image}
                  alt={blog.title}
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "250px",
                    objectFit: "contain",
                    borderRadius: "8px",
                  }}
                  onError={(e) => (e.target.src = "/fallback-image.png")}
                />
              </div>
            ) : (
              <div style={{ marginBottom: "10px" }}>
                <img
                  src="/fallback-image.png"
                  alt="No image"
                  style={{
                    width: "100%",
                    height: "auto",
                    maxHeight: "250px",
                    objectFit: "contain",
                    borderRadius: "8px",
                  }}
                />
              </div>
            )}

            <h3
              style={{
                fontSize: "1.2rem",
                fontWeight: "600",
                color: "#333",
                marginBottom: "10px",
              }}
            >
              {blog.title}
            </h3>

            <div
              style={{
                fontSize: "0.95rem",
                color: "#555",
                marginBottom: "12px",
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
              dangerouslySetInnerHTML={{
                __html:
                  blog.content.length > 100
                    ? blog.content.substring(0, 100) + "..."
                    : blog.content,
              }}
            />

            <Link
              to={`/blog/${blog._id}`}
              style={{
                textDecoration: "none",
                color: "#007bff",
                fontWeight: "500",
              }}
            >
              Read More <i className="fas fa-arrow-right"></i>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
