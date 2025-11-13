import { useState, useEffect } from "react";
import { fetchBlogs } from "../services/blogService";

export const useBlogs = (filters = {}) => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadBlogs = async () => {
    setLoading(true);
    setError(null);

    try {
      const activeFilters = {};
      if (filters.categories?.length)
        activeFilters.categories = filters.categories;
      if (filters.status && filters.status !== "All")
        activeFilters.status = filters.status;
      if (filters.sort) activeFilters.sort = filters.sort;

      const data = await fetchBlogs(activeFilters);
      // 👇 ADD THIS LINE HERE
      console.log("Fetched blogs:", data.length || data.blogs?.length);
      setBlogs(Array.isArray(data) ? data : data.blogs || []);
    } catch (err) {
      setError(err.response?.data || err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, [JSON.stringify(filters)]);

  return { blogs, loading, error, reload: loadBlogs };
};
