// server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const connectDB = require("./config/db");

const adminRoutes = require("./routes/adminRoutes");
const blogRoutes = require("./routes/blogRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const employeeRoutes = require("./routes/employeeRoutes");
const feedbackRoutes = require("./routes/message");
const publicFeedbackRoute = require("./routes/publicFeedback");
const contactSettingsRoutes = require("./routes/contactSettingsRoutes");
const aboutSettingsRoutes = require("./routes/aboutSettingsRoutes");
const subcategoryRoutes = require("./routes/subcategoryRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Database connection
connectDB();

// Routes
app.use("/api/admin", adminRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/employees", employeeRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/public-feedback", publicFeedbackRoute);
app.use("/api/contact-settings", contactSettingsRoutes);
app.use("/api/about-settings", aboutSettingsRoutes);
app.use("/api/subcategories", subcategoryRoutes);
app.use("/api/departments", departmentRoutes);
// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error" });
});

const Admin = require("./models/Admin"); // Make sure this import exists
const bcrypt = require("bcryptjs");

// 🔹 ADD THIS RESET ROUTE
app.get("/reset-admin-pass", async (req, res) => {
  try {
    const admin = await Admin.findOne({ email: "imran33s786@gmail.com" });

    if (!admin) return res.send("Admin not found!");

    const newPassword = "Admin@123";

    admin.password = newPassword; // <- must be plain text
    await admin.save(); // <- schema will hash automatically

    res.send("Password successfully reset to: " + newPassword);
  } catch (err) {
    console.log(err);
    res.status(500).send("Error resetting password");
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
