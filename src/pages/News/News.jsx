import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BlogCard from  "../../components/BlogCard";
 

const News = () => {
  const { category } = useParams();
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

        // ✅ Filter by category and active status
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

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "0px" }}>
      <h2 style={headingStyle}>{category} News</h2>

      {blogs.length === 0 ? (
        <p style={{ textAlign: "center" }}>No news found in this category.</p>
      ) : (
        <div className="blog-grid">
          {blogs.map((blog) => (
            <BlogCard
              key={blog._id}
              image={blog.image}
              title={blog.title}
              description={blog.content}
              category={blog.category}
              createdAt={blog.createdAt}
              link={`/blog/${blog._id}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default News;
