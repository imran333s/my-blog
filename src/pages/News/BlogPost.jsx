import React, { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./BlogPost.css";
import "./Blogs.css";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [similarBlogs, setSimilarBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/blogs/${id}`);
        setBlog(res.data);

        const similarRes = await axios.get(
          `${API_URL}/api/blogs/${id}/similar`
        );
        setSimilarBlogs(similarRes.data);
      } catch (err) {
        console.error("Error fetching blog:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id, API_URL]);

  if (loading) return <p className="loading">Loading blog...</p>;
  if (!blog) return <p className="not-found">Blog not found.</p>;

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
      <div className="container blog-post">
        {blog.image && (
          <img src={blog.image} alt={blog.title} className="post-image" />
        )}

        {blog.videoLink && (
          <div className="blog-video">
            <iframe
              width="100%"
              height="400"
              src={convertToEmbedURL(blog.videoLink)}
              title="Blog video"
              frameBorder="0"
              allowFullScreen
            ></iframe>
          </div>
        )}

        <h1 className="post-title">{blog.title}</h1>

        <div className="post-meta">
          <span className="post-category">
            {blog.category?.name || "General"}
          </span>

          <span className="post-date">
            {new Date(blog.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div
          className="post-body"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </div>

      {/* ================= Similar News Section ================= */}

      {similarBlogs.length > 0 && (
        <div className="similar-blogs-container">
          <h2>Similar News</h2>
          <div className="blog-grid">
            {similarBlogs.map((blog) => (
              <div
                className="blog-card"
                key={blog._id}
                onClick={() => {
                  navigate(`/blog/${blog._id}`);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                {blog.image ? (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    onError={(e) => (e.target.src = "/fallback-image.png")}
                  />
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
      )}
    </main>
  );
};

export default BlogPost;
