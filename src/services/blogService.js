import api from "./api";

/**
 * Fetch blogs with optional filters
 * Always returns an array, never an object
 */
export const fetchBlogs = async (filters = {}) => {
  try {
    const token = localStorage.getItem("token");

    const params = {};
    if (filters.categories?.length)
      params.categories = filters.categories.join(",");
    if (filters.status && filters.status !== "All")
      params.status = filters.status;
    if (filters.sort) params.sort = filters.sort;

    const res = await api.get("/api/blogs", {
      params,
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    });

    // Always return a flat array of blogs
    if (Array.isArray(res.data)) return res.data;
    if (res.data.blogs && Array.isArray(res.data.blogs)) return res.data.blogs;

    // Fallback empty array
    return [];
  } catch (err) {
    console.error("Failed to fetch blogs:", err);
    // Normalize error as a string for safe rendering in React
    const message =
      err.response?.data?.message ||
      err.message ||
      "Failed to fetch blogs. Please try again.";
    // Throw an Error with string message
    throw new Error(message);
  }
};

/**
 * Fetch active categories
 */
export const fetchCategories = async () => {
  try {
    const res = await api.get("/api/categories");
    return res.data.filter(
      (cat) => cat.status?.trim().toLowerCase() === "active"
    );
  } catch (err) {
    console.error("Failed to fetch categories:", err);
    throw new Error(
      err.response?.data?.message ||
        err.message ||
        "Failed to fetch categories."
    );
  }
};

/**
 * Delete a blog by ID
 */
export const deleteBlog = async (id) => {
  try {
    const token = localStorage.getItem("token");
    await api.delete(`/api/blogs/${id}`, {
      headers: { Authorization: token ? `Bearer ${token}` : "" },
    });
  } catch (err) {
    console.error("Failed to delete blog:", err);
    throw new Error(
      err.response?.data?.message || err.message || "Failed to delete blog."
    );
  }
};
