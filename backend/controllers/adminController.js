  const jwt = require("jsonwebtoken");
  const Admin = require("../models/Admin");

  exports.loginAdmin = async (req, res) => {
    const { email, password } = req.body;
    try {
      const admin = await Admin.findOne({ email });
      if (!admin || admin.password !== password)
        return res.status(401).json({ message: "Invalid credentials" });

      const token = jwt.sign(
        { id: admin._id, email: admin.email },
        process.env.JWT_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ success: true, message: "Login successful", token });
    } catch {
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
