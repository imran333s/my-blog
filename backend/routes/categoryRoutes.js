const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getAllCategories,
  getAllCategoriesAdmin,
  getCategoryById,
  addCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categoryController");

router.get("/", getAllCategories);
router.get("/admin", auth, getAllCategoriesAdmin);
router.get("/:id", getCategoryById);
router.post("/", auth, addCategory);
router.put("/:id", auth, updateCategory);
router.delete("/:id", auth, deleteCategory);

module.exports = router;
