import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import BlogCard from "./BlogCard";


const Search = () => {
  const query = new URLSearchParams(useLocation().search).get("q");
  const [blogs, setBlogs] = useState([]);

  const API_URL = process.env.REACT_APP_API_URL;

  useEffect(() => {
    fetch(`${API_URL}/api/blogs/search?q=${query}`)
      .then((res) => res.json())
      .then((data) => setBlogs(data));
  }, [query]);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
      <h2 style={{ textAlign: "center", marginBottom: "15px" }}>
        Search results for: <b>{query}</b>
      </h2>

      <div className="blog-grid">
        {blogs.map((b) => (
          <BlogCard key={b._id} {...b} link={`/blog/${b._id}`} />
        ))}
      </div>
    </div>
  );
};

export default Search;
