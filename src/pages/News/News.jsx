import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Select from "react-select"; // modern dropdown
import BlogCard from "../../components/BlogCard";

const News = () => {
  const { category } = useParams();
  const resolvedCategory = (category || "all").toLowerCase();

  const [blogs, setBlogs] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [subcategories, setSubcategories] = useState([]);
  const [selectedSubcategory, setSelectedSubcategory] = useState("");

  const API_URL = process.env.REACT_APP_API_URL;

  const fetchBlogs = async () => {
    if (loading) return;
    setLoading(true);
    try {
      let url = `${API_URL}/api/blogs/public/paginated?page=${page}&limit=6&category=${resolvedCategory}`;
      if (selectedSubcategory)
        url += `&subcategory=${selectedSubcategory.toLowerCase()}`;

      const res = await fetch(url);
      const data = await res.json();
      const blogsArray = Array.isArray(data) ? data : data.blogs || [];

      if (blogsArray.length < 6) setHasMore(false);

      setBlogs((prev) => {
        const ids = new Set(prev.map((b) => b._id));
        const newBlogs = blogsArray.filter((b) => !ids.has(b._id));
        return [...prev, ...newBlogs];
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Reset on category change
  useEffect(() => {
    setBlogs([]);
    setPage(1);
    setHasMore(true);
    setLoading(false);
    window.scrollTo(0, 0);
    fetchBlogs();
  }, [resolvedCategory]);

  // Fetch on subcategory change
  useEffect(() => {
    setBlogs([]);
    setPage(1);
    setHasMore(true);
    fetchBlogs();
  }, [selectedSubcategory]);

  // Load more on page increment
  useEffect(() => {
    if (page > 1) fetchBlogs();
  }, [page]);

  // Fetch subcategories
  useEffect(() => {
    if (!resolvedCategory || resolvedCategory === "all") {
      setSubcategories([]);
      setSelectedSubcategory("");
      return;
    }

    const fetchSubcategories = async () => {
      try {
        const catRes = await fetch(`${API_URL}/api/categories`);
        const categories = await catRes.json();
        const categoryDoc = categories.find(
          (c) => c.name.toLowerCase() === resolvedCategory
        );

        if (categoryDoc) {
          const subRes = await fetch(
            `${API_URL}/api/subcategories?category=${categoryDoc._id}`
          );
          const subData = await subRes.json();
          setSubcategories(subData);
          setSelectedSubcategory("");
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchSubcategories();
  }, [resolvedCategory]);

  return (
    <div
      style={{
        maxWidth: "1200px",
        margin: "0 auto",
        padding: "2px 20px 20px 20px",
      }}
    >
      {/* Category Heading */}
      <h2
        style={{
          textAlign: "center",
          marginBottom: "25px",
          textTransform: "capitalize",
        }}
      >
        {resolvedCategory} News
      </h2>

      {/* Subcategory Filter */}
      {subcategories.length > 0 && (
        <div style={{ marginBottom: "30px" }}>
          <Select
            options={subcategories.map((sub) => ({
              value: sub.name,
              label: sub.name,
            }))}
            value={
              selectedSubcategory
                ? { value: selectedSubcategory, label: selectedSubcategory }
                : null
            }
            onChange={(option) => setSelectedSubcategory(option?.value || "")}
            placeholder={`All ${resolvedCategory} news`}
            isClearable
            styles={{
              container: (provided) => ({
                ...provided,
                maxWidth: 300,
                margin: "0 auto",
              }),
              control: (provided) => ({
                ...provided,
                borderRadius: "8px",
                borderColor: "#ccc",
                fontSize: "16px",
              }),
              menu: (provided) => ({ ...provided, fontSize: "16px" }),
            }}
          />
        </div>
      )}

      {/* Blog Grid */}
      <div className="blog-grid">
        {blogs.map((blog) => (
          <BlogCard
            key={blog._id}
            image={blog.image}
            title={blog.title}
            description={blog.content}
            category={blog.category?.name || "Uncategorized"}
            createdAt={blog.createdAt}
            link={`/blog/${blog._id}`}
          />
        ))}
      </div>

      {/* Loading */}
      {loading && (
        <p style={{ textAlign: "center", marginTop: "20px" }}>Loading...</p>
      )}

      {/* Load More Button */}
      {hasMore && !loading && (
        <div style={{ textAlign: "center", marginTop: "30px" }}>
          <button
            onClick={() => setPage((prev) => prev + 1)}
            style={{
              padding: "12px 24px",
              fontSize: "16px",
              cursor: "pointer",
              borderRadius: "8px",
              background: "#007bff",
              color: "white",
              border: "none",
              transition: "background 0.2s",
            }}
            onMouseOver={(e) => (e.currentTarget.style.background = "#0056b3")}
            onMouseOut={(e) => (e.currentTarget.style.background = "#007bff")}
          >
            Load More
          </button>
        </div>
      )}
    </div>
  );
};

export default News;
