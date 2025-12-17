const User = require("../models/User");
const bcrypt = require("bcryptjs");

// Create user (Admin only)

exports.createUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      role,
      mobile,
      department,
      dob,
      startDate,
      reportingManager,
    } = req.body;

    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "Email already exists" });

    const user = new User({
      name,
      email,
      password,
      role,
      mobile,
      department,
      dob,
      startDate,
      reportingManager,
    });

    await user.save();

    res.json({ success: true, message: "User created", user });
  } catch (err) {
    console.error("Create user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all users (Admin + Manager)
exports.getUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};

exports.getUserById = async (req, res) => {
  // console.log("\n===== DEBUG START =====");
  // console.log("Requested ID:", req.params.id);
  // console.log("Logged-in user:", req.user.name, "| Role:", req.user.role);

  try {
    const user = await User.findById(req.params.id).select("-password");
    // console.log("Found user:", user);
    // console.log("===== DEBUG END =====\n");

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json(user);
  } catch (err) {
    console.log("ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
};



// Update user (Admin only)
exports.updateUser = async (req, res) => {
  try {
    const updates = req.body; // frontend can send any/all fields
    const user = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({ success: true, message: "User updated", user });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// Delete user (Admin only)
exports.deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "User deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};
