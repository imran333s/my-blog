import api from "./api";

export const fetchBlogs = async (filters = {}) => {
  const token = localStorage.getItem("token");

  const params = {};
  if (filters.categories?.length)
    params.categories = filters.categories.join(",");
  if (filters.status && filters.status !== "All")
    params.status = filters.status;
  if (filters.sort) params.sort = filters.sort;

  const res = await api.get("/api/blogs", {
    params,
    headers: { Authorization: `Bearer ${token}` },
  });

  // Always return a flat array of blogs
  if (Array.isArray(res.data)) return res.data;
  if (res.data.blogs && Array.isArray(res.data.blogs)) return res.data.blogs;

  // fallback
  return [];
};

// Fetch active categories
export const fetchCategories = async () => {
  const res = await api.get("/api/categories");
  return res.data.filter(
    (cat) => cat.status?.trim().toLowerCase() === "active"
  );
};

// Delete blog
export const deleteBlog = async (id) => {
  const token = localStorage.getItem("token");
  await api.delete(`/api/blogs/${id}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
};
