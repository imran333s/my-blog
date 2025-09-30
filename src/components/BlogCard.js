import React from "react";
import { Link } from "react-router-dom";

const BlogCard = ({ image, title, description, link }) => {
  // Helper function to truncate text
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.slice(0, maxLength) + "...";
  };

  return (
    <div className="blog-card">
      <div className="blog-image">
        <img src={image} alt={title} />
      </div>
      <h3 className="blog-title">{title}</h3>
      <p className="blog-description">{truncateText(description, 120)}</p>
      <Link to={link} className="read-more">
        Read More <i className="fas fa-arrow-right"></i>
      </Link>
    </div>
  );
};

export default BlogCard;
