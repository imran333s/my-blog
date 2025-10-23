import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BlogPost.css";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [similarBlogs, setSimilarBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL; // Use environment variable

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/blogs/${id}`);
        setBlog(res.data);

        // ✅ Fetch similar blogs after main blog loads
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

    // YouTube normal URL
    let youtubeMatch = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/shorts\/)([\w-]+)/
    );
    if (youtubeMatch) {
      // autoplay=1 will start the video automatically
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&mute=1`;
      // mute=1 is required for autoplay in most browsers
    }

    // Vimeo URL
    let vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1&muted=1`;
    }

    return url; // fallback
  };

  return (
    <main className="main-content">
      <div className="container blog-post">
        {blog.image && (
          <img src={blog.image} alt={blog.title} className="post-image" />
        )}

        {/* ✅ Show video section if a video link exists */}
        {blog.videoLink && (
          <div className="blog-video">
            {/* <h3 className="video-title">Watch Related Video</h3> */}
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
          <span className="post-category">{blog.category || "General"}</span>
          <span className="post-status">{blog.status}</span>
          <span className="post-date">
            {new Date(blog.createdAt).toLocaleDateString()}
          </span>
        </div>

        <div
          className="post-body"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
        {/* ✅ Similar Blogs Section */}
        {/* ================= Similar Blogs Section ================= */}
        {similarBlogs.length > 0 && (
          <div className="similar-blogs-container">
            <h2>Similar News</h2>
            {/* <p className="similar-hint">
              Showing more from <strong>{blog.category}</strong> related to this
              article.
            </p> */}

            <div className="similar-grid">
              {similarBlogs.map((item) => (
                <div
                  key={item._id}
                  className="similar-card"
                  onClick={() => {
                    navigate(`/blog/${item._id}`);
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                >
                  {item.image && <img src={item.image} alt={item.title} />}
                  <h3>{item.title}</h3>
                  <p>{item.category}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Optional: Edit button if admin functionality is needed */}
        {/* <button onClick={handleEdit} className="edit-btn">Edit</button> */}
      </div>
    </main>
  );
};

export default BlogPost;
