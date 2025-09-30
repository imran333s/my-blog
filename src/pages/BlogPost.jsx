import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./BlogPost.css";

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/blogs/${id}`);
        setBlog(res.data);
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  if (loading) return <p className="loading">Loading blog...</p>;
  if (!blog) return <p className="not-found">Blog not found.</p>;

  // ✅ Navigate to edit page
  const handleEdit = () => {
    navigate(`/edit-blog/${id}`);
  };

  return (
    <main className="main-content">
      <div className="container blog-post">
        <h1 className="post-title">{blog.title}</h1>

        {blog.image && (
          <img src={blog.image} alt={blog.title} className="post-image" />
        )}

        <div className="post-body">
          <p>{blog.content}</p>
        </div>

        
      </div>
    </main>
  );
};

export default BlogPost;
