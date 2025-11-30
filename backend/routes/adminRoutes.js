const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  loginAdmin,
  getAdminProfile,
   getDashboardStats,
   changePassword,
} = require("../controllers/adminController");
 

router.post("/login", loginAdmin);
router.get("/me", getAdminProfile);
router.get("/dashboard-stats", auth, getDashboardStats);
router.post("/change-password", auth,changePassword);
module.exports = router;
