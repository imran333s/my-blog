

import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import "./Blogs.css"; // ✅ same styling as BlogList

const News = () => {
  const { category } = useParams();
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

        // Filter by category and active status
        const filtered = data.filter(
          (blog) =>
            blog.status &&
            blog.status.toLowerCase() === "active" &&
            blog.category &&
            blog.category.toLowerCase() === category.toLowerCase()
        );
        setBlogs(filtered);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, [category, API_URL]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (error)
    return <p style={{ textAlign: "center", color: "red" }}>Error: {error}</p>;

  const headingStyle = {
    textAlign: "center",
    marginBottom: "15px",
    textTransform: "capitalize",
  };

  const convertToEmbedURL = (url) => {
    if (!url) return "";

    // YouTube normal URL, short URL, or shorts
    let youtubeMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]+)/
    );
    if (youtubeMatch)
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&mute=1`;

    // Vimeo
    let vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch)
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1`;

    return url; // fallback
  };

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0px" }}>
      <h2 style={headingStyle}>{category} News</h2>

      {blogs.length === 0 ? (
        <p style={{ textAlign: "center" }}>No news found in this category.</p>
      ) : (
        <div className="blog-grid">
          {blogs.map((blog) => (
            <div className="blog-card" key={blog._id}>
              <div style={{ marginBottom: "7px" }}>
                <img
                  src={blog.image || "/fallback-image.png"}
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

              {/* ✅ Video embed below image */}
              {blog.videoLink && (
                <div
                  style={{
                    marginBottom: "10px",
                    position: "relative",
                    paddingTop: "56.25%",
                  }}
                >
                  <iframe
                    src={convertToEmbedURL(blog.videoLink)}
                    title={blog.title + " video"}
                    style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      border: 0,
                      borderRadius: "8px",
                    }}
                    allow="autoplay; encrypted-media; fullscreen"
                    allowFullScreen
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
      )}
    </div>
  );
};

export default News;
