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
        const response = await fetch(`${API_URL}/api/blogs/public`);
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
      <h2 style={{ textAlign: "center", marginBottom: "10px" }}>News</h2>

      <div className="blog-grid">
  {filteredBlogs.map((blog) => (
    <div className="blog-card" key={blog._id}>
      {blog.image ? (
        <img src={blog.image} alt={blog.title} onError={(e) => (e.target.src = "/fallback-image.png")} />
      ) : (
        <img src="/fallback-image.png" alt="No image" />
      )}

      <h3>{blog.title}</h3>

      <div
        className="content-snippet"
        dangerouslySetInnerHTML={{
          __html:
            blog.content.length > 100
              ? blog.content.substring(0, 100) + "..."
              : blog.content,
        }}
      />

      <Link to={`/blog/${blog._id}`} className="read-more">
        Read More <i className="fas fa-arrow-right"></i>
      </Link>
    </div>
  ))}
</div>

    </div>
  );
};

export default BlogList;
