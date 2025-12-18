import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Trending.css";

const Trending = () => {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const { data } = await axios.get(
          `${API_URL}/api/blogs/trending/public`
        );
        setTrending(data);
      } catch (err) {
        console.error("❌ Error fetching trending blogs:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrending();
  }, [API_URL]);

  return (
    <div className="page-wrapper">
      <section className="trending-section">
        <h2 className="trending-title">🔥 Trending News</h2>

        {loading ? (
          <div className="trending-grid">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="trending-card skeleton" />
            ))}
          </div>
        ) : trending.length === 0 ? (
          <div className="no-trending">
            <p>No trending news in the last 24 hours.</p>
            <p>Check back later ✨</p>
          </div>
        ) : (
          <div className="trending-grid">
            {trending.map((blog) => (
              <div
                key={blog._id}
                className="trending-card"
                onClick={() => {
                  navigate(`/blog/${blog._id}`);
                  window.scrollTo({ top: 0, behavior: "smooth" });
                }}
              >
                <img
                  src={blog.image || "/fallback-image.png"}
                  alt={blog.title}
                  className="trending-image"
                  onError={(e) => (e.target.src = "/fallback-image.png")}
                />

                <div className="trending-info">
                  <div className="trending-category">
                    {blog.category?.name || "General"}
                  </div>

                  <div className="trending-heading">{blog.title}</div>

                  <div className="content-snippet">
                    {blog.content.replace(/<[^>]+>/g, "").slice(0, 120)}
                    ...
                  </div>

                  <Link
                    to={`/blog/${blog._id}`}
                    className="read-more"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Read More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};

export default Trending;
