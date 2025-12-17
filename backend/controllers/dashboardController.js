const Blog = require("../models/Blog");
const Category = require("../models/Category");
const Department = require("../models/Department");
const Message = require("../models/Message");
const User = require("../models/User"); // all users including employees/admins
const PublicFeedback = require("../models/PublicFeedback");

exports.getDashboardStats = async (req, res) => {
  try {
    // NO NEED for admin-only check here.
    // allowRoles() middleware already filters who can access.

    const stats = {
      totalNews: await Blog.countDocuments(),
      totalCategories: await Category.countDocuments(),
      totalDepartments: await Department.countDocuments(),

      totalEmployees: await User.countDocuments({ role: { $ne: "admin" } }),
      totalAdmins: await User.countDocuments({ role: { $regex: /^admin$/i } }),
      totalManagers: await User.countDocuments({
        role: { $regex: /^manager$/i },
      }),

      activeNews: await Blog.countDocuments({ status: "Active" }),
      inactiveNews: await Blog.countDocuments({ status: "Inactive" }),

      activeEmployees: await User.countDocuments({
        status: "active",
        role: { $ne: "admin" },
      }),

      totalMessages: await Message.countDocuments(),
      // ✅ NEW: Public Feedback count
      totalPublicFeedback: await PublicFeedback.countDocuments(),
    };

    res.json(stats);
  } catch (error) {
    console.error("Dashboard stats error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
