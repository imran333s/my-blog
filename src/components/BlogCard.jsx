import React from "react";
import { Link } from "react-router-dom";
import "./BlogCard.css";

const BlogCard = ({ image, title, description, link, category, createdAt }) => {
  // Function to truncate HTML content
  const truncateHTML = (html, maxLength) => {
    const div = document.createElement("div");
    div.innerHTML = html;
    const text = div.textContent || div.innerText || "";
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const seconds = Math.floor(diffMs / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0)
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ago`;
    if (minutes > 0) return `${minutes} minute${minutes > 1 ? "s" : ""} ago`;
    return "Just now";
  };

  return (
    <div className="blog-card">
      <div className="blog-image">
        <img
          src={image || "/fallback-image.png"}
          alt={title}
          onError={(e) => (e.target.src = "/fallback-image.png")}
        />
      </div>

      <div className="blog-header">
        <h3>{title}</h3>
        <span className="blog-category">{category || "Uncategorized"}</span>
      </div>

      {/* Render truncated HTML content */}
      <p
        className="content-snippet"
        dangerouslySetInnerHTML={{ __html: truncateHTML(description, 120) }}
      ></p>

      <div className="blog-footer">
        <Link to={link} className="read-more">
          Read More <i className="fas fa-arrow-right"></i>
        </Link>
        <span className="blog-time">{formatTime(createdAt)}</span>
      </div>
    </div>
  );
};

export default BlogCard;
