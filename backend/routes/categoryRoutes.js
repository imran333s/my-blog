const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getAllCategories,
  addCategory,
} = require("../controllers/categoryController");

router.get("/", getAllCategories);
router.post("/", auth, addCategory);

module.exports = router;
