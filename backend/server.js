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
// Global error handler (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
