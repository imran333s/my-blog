const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Blog = require("../models/Blog");
const Category = require("../models/Category");
const Employee = require("../models/Employee");


exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;
  try {
    const admin = await Admin.findOne({ email });
    if (!admin || admin.password !== password)
      return res.status(401).json({ message: "Invalid credentials" });

    // Add role and type to payload
    const token = jwt.sign(
      {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: "Admin", // 👈 Add role here
        type: "admin", // 👈 Optional, if you use type-based middleware
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ success: true, message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getAdminProfile = async (req, res) => {
  try {
    const admin = await Admin.findOne().select("-password");
    if (!admin) return res.status(404).json({ message: "Admin not found" });
    res.json({
      name: admin.name,
      email: admin.email,
      role: admin.role,
      websiteName: "News Website",
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ NEW: Dashboard Statistics Controller
exports.getDashboardStats = async (req, res) => {
  try {
    // Fetch counts
    const totalNews = await Blog.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalEmployees = await Employee.countDocuments();

    const activeNews = await Blog.countDocuments({ status: "Active" });
    const inactiveNews = await Blog.countDocuments({ status: "Inactive" });

    const activeEmployees = await Employee.countDocuments({ status: "Active" });
    const inactiveEmployees = await Employee.countDocuments({
      status: "Inactive",
    });

    const totalAdmins = await Admin.countDocuments();

    // Return all stats as JSON
    res.status(200).json({
      totalNews,
      totalCategories,
      totalEmployees,
      activeNews,
      inactiveNews,
      activeEmployees,
      inactiveEmployees,
      totalAdmins,
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({ message: "Failed to fetch dashboard stats" });
  }
};
