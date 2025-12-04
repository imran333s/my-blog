const jwt = require("jsonwebtoken");
const Admin = require("../models/Admin");
const Blog = require("../models/Blog");
const Category = require("../models/Category");
const Employee = require("../models/Employee");
const Department = require("../models/Department"); // ✅ MUST ADD THIS
const bcrypt = require("bcryptjs");
const Message = require("../models/Message");
exports.loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    const isMatch = await bcrypt.compare(password, admin.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      {
        id: admin._id,
        name: admin.name,
        email: admin.email,
        role: admin.role,
        type: "admin",
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
    const admin = await Admin.findById(req.user.id).select("-password");

    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    res.json({
      name: admin.name,
      email: admin.email,
      role: admin.role,
      websiteName: "News Website",
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ UPDATED DASHBOARD STATS (WITH DEPARTMENTS)
exports.getDashboardStats = async (req, res) => {
  try {
    const totalNews = await Blog.countDocuments();
    const totalCategories = await Category.countDocuments();
    const totalDepartments = await Department.countDocuments();

    // ⭐ Count ONLY non-admin employees
    const totalEmployees = await Employee.countDocuments({
      role: { $ne: "Admin" },
    });

    // ⭐ Admin counts (super admin + admins inside employee table)
    const superAdmins = await Admin.countDocuments();
    const normalAdmins = await Employee.countDocuments({ role: "Admin" });
    const totalAdmins = superAdmins + normalAdmins;

  const activeNews = await Blog.countDocuments({ status: "Active" });
const inactiveNews = await Blog.countDocuments({ status: "Inactive" });


    const activeEmployees = await Employee.countDocuments({
      status: "active",
      role: { $ne: "Admin" },
    });

    const inactiveEmployees = await Employee.countDocuments({
      status: "inactive",
      role: { $ne: "Admin" },
    });

    const totalMessages = await Message.countDocuments();

    res.json({
      totalNews,
      totalCategories,
      totalDepartments,
      totalEmployees, // ✔ Non-admin employees only
      totalAdmins, // ✔ Superadmin + admin roles inside employees
      activeNews,
      inactiveNews,
      activeEmployees,
      inactiveEmployees,
      totalMessages,
    });
  } catch (err) {
    res.status(500).json({ error: "Server Error" });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const adminId = req.user.id;
    const { oldPassword, newPassword } = req.body;

    const admin = await Admin.findById(adminId);
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await bcrypt.compare(oldPassword, admin.password);
    if (!isMatch)
      return res.status(400).json({ message: "Old password is incorrect" });

    const isSamePassword = await bcrypt.compare(newPassword, admin.password);
    if (isSamePassword)
      return res
        .status(400)
        .json({ message: "New password must be different" });

    admin.password = newPassword;
    await admin.save();

    res.json({ message: "Password updated successfully 🎉" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};
