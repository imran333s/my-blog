import React from "react";
import "./BlogList.css";

export const BlogPagination = ({ blogs, currentPage, perPage, setPage }) => {
  const totalPages = Math.ceil(blogs.length / perPage);
  if (totalPages <= 1) return null;

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination-container">
      <button
        disabled={currentPage === 1}
        onClick={() => setPage(currentPage - 1)}
        className="pagination-btn"
      >
        ◀ Prev
      </button>

      {pages.map((page) => (
        <button
          key={page}
          className={`pagination-btn ${
            currentPage === page ? "active-page" : ""
          }`}
          onClick={() => setPage(page)}
        >
          {page}
        </button>
      ))}

      <button
        disabled={currentPage === totalPages}
        onClick={() => setPage(currentPage + 1)}
        className="pagination-btn"
      >
        Next ▶
      </button>
    </div>
  );
};
