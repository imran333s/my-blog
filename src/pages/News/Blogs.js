import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Blogs.css";

const BlogList = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const API_URL = process.env.REACT_APP_API_URL;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/api/categories`);
        if (!res.ok) throw new Error("Failed to fetch categories");
        const data = await res.json();
        setCategories(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, [API_URL]);

  if (loading) return <p style={{ textAlign: "center" }}>Loading...</p>;
  if (error)
    return <p style={{ textAlign: "center", color: "red" }}>Error: {error}</p>;

  return (
    <div className="category-container">
      <h2 className="category-title">📰 Explore News by Category</h2>
      <div className="category-grid">
        {categories.map((cat) => (
          <div
            key={cat._id}
            className="category-card"
            onClick={() => navigate(`/news/${cat.name}`)}
            style={{ cursor: "pointer" }}
          >
            <img
              src={cat.image || "/category-placeholder.jpg"}
              alt={cat.name}
              className="category-image"
              onError={(e) => (e.target.src = "/category-placeholder.jpg")}
            />
            <h3 className="category-name">{cat.name}</h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogList;
