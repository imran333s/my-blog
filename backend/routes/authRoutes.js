const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const User = require("../models/User");
const { login } = require("../controllers/authController");

// Login route
router.post("/login", login);

// GET /api/auth/me - get current logged-in user
router.get("/me", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    // Always return a safe object with name and role
    if (!user) {
      return res.json({ name: "", role: "" });
    }

    return res.json({
      name: user.name || "",
      role: user.role ? user.role.toLowerCase() : "",
    });
  } catch (err) {
    console.error("Error fetching logged-in user:", err);

    // Always return safe defaults
    return res.json({ name: "", role: "" });
  }
});

module.exports = router;
