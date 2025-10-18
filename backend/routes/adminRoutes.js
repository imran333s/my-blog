const express = require("express");
const router = express.Router();
const { loginAdmin, getAdminProfile } = require("../controllers/adminController");

router.post("/login", loginAdmin);
router.get("/me", getAdminProfile);

module.exports = router;
