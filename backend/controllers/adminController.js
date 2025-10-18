  const jwt = require("jsonwebtoken");
  const Admin = require("../models/Admin");
  const Blog = require("../models/Blog");

  // GET /api/admin/blogs?categories=Sports,Politics&status=Active&sort=newest
exports.getFilteredBlogs = async (req, res) => {
  try {
    const { categories, status, sort } = req.query;
    const filter = {};

    // ✅ Category filter
    if (categories) {
      const categoryArray = categories.split(",").map((c) => c.trim());
      filter.category = { $in: categoryArray };
    }

    // ✅ Status filter
    if (status && status !== "All") {
      filter.status = status;
    }

    // ✅ Sorting
    let sortOption = { createdAt: -1 }; // default newest
    if (sort === "oldest") sortOption = { createdAt: 1 };

    // ✅ Fetch blogs from MongoDB
    const blogs = await Blog.find(filter).sort(sortOption);

    res.status(200).json(blogs);
  } catch (err) {
    console.error("Error fetching blogs:", err);
    res.status(500).json({ message: "Failed to fetch blogs" });
  }
};


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
