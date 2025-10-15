import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BlogPost.css";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const API_URL = process.env.REACT_APP_API_URL; // Use environment variable

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/blogs/${id}`);
        setBlog(res.data);
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

  // Navigate to edit page
  const handleEdit = () => {
    navigate(`/edit-blog/${id}`);
  };

  return (
    <main className="main-content">
  <div className="container blog-post">
    {blog.image && (
      <img src={blog.image} alt={blog.title} className="post-image" />
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

    {/* Optional: Edit button if admin functionality is needed */}
    {/* <button onClick={handleEdit} className="edit-btn">Edit</button> */}
  </div>
</main>

  );
};

export default BlogPost;
