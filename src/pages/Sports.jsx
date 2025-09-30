import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Sports = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/blogs");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();

        // Filter only sports category
        const sportsBlogs = data.filter((blog) => blog.category === "Sports");
        setBlogs(sportsBlogs);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (error) return <p style={{ textAlign: "center" }}>Error: {error}</p>;

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "20px" }}>
      <h2 style={{ textAlign: "center", marginBottom: "20px" }}>
        Sports Blogs
      </h2>

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
          gap: "20px",
        }}
      >
        {blogs.map((blog) => (
          <div
            key={blog._id}
            style={{
              background: "#fff",
              borderRadius: "12px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
              padding: "15px",
            }}
          >
            {blog.image && (
              <div style={{ marginBottom: "10px" }}>
                <img
                  src={blog.image}
                  alt={blog.title}
                  style={{
                    width: "100%",
                    height: "auto", // keep aspect ratio
                    maxHeight: "250px", // optional, prevents huge images
                    objectFit: "contain", // show full image without cropping
                    borderRadius: "8px",
                  }}
                />
              </div>
            )}
            <h3>{blog.title}</h3>
            <p
              style={{
                display: "-webkit-box",
                WebkitLineClamp: 3,
                WebkitBoxOrient: "vertical",
                overflow: "hidden",
              }}
            >
              {blog.content}
            </p>
            <Link
              to={`/blog/${blog._id}`}
              style={{ color: "#007bff", textDecoration: "none" }}
            >
              Read More
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Sports;
