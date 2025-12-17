// routes/dashboardRoutes.js
const express = require("express");
const router = express.Router();

const { getDashboardStats } = require("../controllers/dashboardController");
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/allowRoles");

router.get(
  "/dashboard-stats",
  auth,
  allowRoles("Admin", "Manager"),
  getDashboardStats
);

module.exports = router;
