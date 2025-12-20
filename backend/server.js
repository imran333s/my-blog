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
const feedbackRoutes = require("./routes/messageRoutes");
const publicFeedbackRoute = require("./routes/publicFeedback");
const contactSettingsRoutes = require("./routes/contactSettingsRoutes");
const aboutSettingsRoutes = require("./routes/aboutSettingsRoutes");
const subcategoryRoutes = require("./routes/subcategoryRoutes");
const departmentRoutes = require("./routes/departmentRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");

const app = express();

/* =======================
   ✅ CORS CONFIG (FINAL)
======================= */

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "https://news-managemnent-system.vercel.app",
      "https://news-management-project.netlify.app",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// ✅ Required for preflight requests
app.use(bodyParser.json());
app.use(express.json());

// Database connection
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api", dashboardRoutes);
app.use("/api/blogs", blogRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/feedback", feedbackRoutes);
app.use("/api/public-feedback", publicFeedbackRoute);
app.use("/api/contact-settings", contactSettingsRoutes);
app.use("/api/about-settings", aboutSettingsRoutes);
app.use("/api/subcategories", subcategoryRoutes);
app.use("/api/departments", departmentRoutes);

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: err.message || "Server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
