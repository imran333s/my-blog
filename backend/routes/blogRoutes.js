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
} = require("../controllers/blogController");

// ✅ Log every request for debugging
router.use((req, res, next) => {
  console.log("Blog route:", req.originalUrl);
  next();
});

router.get("/public", getAllBlogs);
router.get("/", auth, getFilteredBlogs);
router.get("/:id", getBlogById);
router.post("/", auth, addBlog);
router.put("/:id", auth, updateBlog);
router.delete("/:id", auth, deleteBlog);

module.exports = router;
