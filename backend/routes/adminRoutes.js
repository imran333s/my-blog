const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  loginAdmin,
  getAdminProfile,
   getDashboardStats,
} = require("../controllers/adminController");
 

router.post("/login", loginAdmin);
router.get("/me", getAdminProfile);
router.get("/dashboard-stats", auth, getDashboardStats);

module.exports = router;
