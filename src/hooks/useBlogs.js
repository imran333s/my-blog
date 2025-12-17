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

      // Debug log
      console.log("Fetched blogs:", data.length || data.blogs?.length);

      // Ensure blogs is always an array
      setBlogs(Array.isArray(data) ? data : data.blogs || []);
    } catch (err) {
      // Normalize error as a string for React
      const message =
        err?.message || // thrown by fetchBlogs
        err?.response?.data?.message || // API error message
        "Failed to fetch blogs.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, [JSON.stringify(filters)]); // re-fetch when filters change

  return { blogs, loading, error, reload: loadBlogs };
};
