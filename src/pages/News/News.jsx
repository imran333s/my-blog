import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BlogCard from "../../components/BlogCard";

const News = () => {
  const { category } = useParams();
  const resolvedCategory = (category || "all").toLowerCase();

  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchBlogs = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const response = await fetch(
        `${API_URL}/api/blogs/public/paginated?page=${page}&limit=6&category=${resolvedCategory}`
      );
      const data = await response.json();

      if (data.length < 6) setHasMore(false);

      setBlogs((prev) => {
        const ids = new Set(prev.map((b) => b._id));
        const newBlogs = data.filter((b) => !ids.has(b._id));
        return [...prev, ...newBlogs];
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Reset states on category change
    setBlogs([]);
    setPage(1);
    setHasMore(true);
    setLoading(false);

    // ✅ Scroll to top *after render*
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 0);

    // Fetch initial data
    fetchBlogs();
  }, [resolvedCategory]);

  useEffect(() => {
    if (page > 1) fetchBlogs(); // load more only when page increases
  }, [page]);

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "80px 20px 20px 20px",
      }}
    >
      <h2
        style={{
          textAlign: "center",
          marginBottom: "15px",
          textTransform: "capitalize",
        }}
      >
        {resolvedCategory} News
      </h2>

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

      {loading && <p style={{ textAlign: "center" }}>Loading...</p>}

      {hasMore && !loading && (
        <div style={{ textAlign: "center", marginTop: "20px" }}>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            style={{
              padding: "10px 20px",
              fontSize: "16px",
              cursor: "pointer",
              borderRadius: "5px",
              background: "#007bff",
              color: "white",
              border: "none",
            }}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default News;
