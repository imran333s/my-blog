import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./Trending.css";

const Trending = () => {
  const [trending, setTrending] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/blogs/trending/public"
        );
        setTrending(res.data);
      } catch (err) {
        console.error("❌ Error fetching trending blogs:", err);
      }
    };
    fetchTrending();
  }, []);

  return (
    <>
      {trending.length > 0 && (
        <section className="trending-section">
          <h2 className="trending-title">🔥 Trending News</h2>
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
                {/* ✅ Blog Image */}
                {blog.image ? (
                  <img
                    src={blog.image}
                    alt={blog.title}
                    className="trending-image"
                    onError={(e) => (e.target.src = "/fallback-image.png")}
                  />
                ) : (
                  <img
                    src="/fallback-image.png"
                    alt="No image"
                    className="trending-image"
                  />
                )}

                {/* ✅ Blog Info */}
                <div className="trending-info">
                  <div className="trending-category">
                    {blog.category || "General"}
                  </div>
                  <div className="trending-heading">{blog.title}</div>

                  {/* ✅ Optional short snippet */}
                  <div
                    className="content-snippet"
                    dangerouslySetInnerHTML={{
                      __html:
                        blog.content.length > 100
                          ? blog.content.substring(0, 100) + "..."
                          : blog.content,
                    }}
                  />

                  {/* ✅ Read More */}
                  <Link
                    to={`/blog/${blog._id}`}
                    className="read-more"
                    onClick={(e) => e.stopPropagation()}
                  >
                    Read More <i className="fas fa-arrow-right"></i>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </>
  );
};

export default Trending;
