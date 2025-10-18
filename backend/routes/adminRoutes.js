const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  loginAdmin,
  getAdminProfile,
} = require("../controllers/adminController");
const { getFilteredBlogs } = require("../controllers/adminController");

router.post("/login", loginAdmin);
router.get("/me", getAdminProfile);
router.get("/blogs", auth, getFilteredBlogs);

module.exports = router;
