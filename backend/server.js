// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const blogRoutes = require("./routes/blogRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const feedbackRoutes = require("./routes/message");
const publicFeedbackRoute = require("./routes/publicFeedback");
const contactSettingsRoutes = require("./routes/contactSettingsRoutes");
const aboutSettingsRoutes = require("./routes/aboutSettingsRoutes");
const subcategoryRoutes = require("./routes/subcategoryRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
connectDB();

// Routes
app.use("/api/auth", authRoutes); // login/signup
app.use("/api/users", userRoutes); // RBAC: Admin/Manager
app.use("/api", dashboardRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/feedback", feedbackRoutes); // admin panel
app.use("/api/public-feedback", publicFeedbackRoute); // public
app.use("/api/contact-settings", contactSettingsRoutes); // admin only
app.use("/api/about-settings", aboutSettingsRoutes); // admin only
app.use("/api/subcategories", subcategoryRoutes); // admin only
app.use("/api/departments", departmentRoutes); // admin only

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error" });
});

// Optional: reset admin password route (for testing/dev only)
const User = require("./models/User"); // Use User model for all roles
app.get("/reset-admin-pass", async (req, res) => {
  try {
    const admin = await User.findOne({
      email: "imran33s786@gmail.com",
      role: "admin",
    });
    if (!admin) return res.send("Admin not found!");

    const newPassword = "Admin@123";
    admin.password = newPassword; // plain text, schema will hash automatically
    await admin.save();

    res.send("Password successfully reset to: " + newPassword);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error resetting password");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
