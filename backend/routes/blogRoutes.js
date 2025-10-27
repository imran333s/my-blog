const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getAllBlogs,
  getBlogById,
  addBlog,
  updateBlog,
  deleteBlog,
  getFilteredBlogs,
  getSimilarBlogs,
  getTrendingBlogs,
} = require("../controllers/blogController");

 
router.get("/trending/public", getTrendingBlogs);
router.get("/public", getAllBlogs);
router.get("/", auth, getFilteredBlogs);
router.get("/:id/similar", getSimilarBlogs);
router.get("/:id", getBlogById);
router.post("/", auth, addBlog);
router.put("/:id", auth, updateBlog);
router.delete("/:id", auth, deleteBlog);

module.exports = router;
