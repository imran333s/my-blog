require("dotenv").config(); // Load environment variables
const jwt = require("jsonwebtoken");
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const app = express();
app.use(cors()); // Allow all origins
app.use(bodyParser.json());

// Connect to MongoDB Atlas using environment variable
mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log("MongoDB connection error:", err));

// ----------------- Admin schema -----------------
const adminSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

const Admin = mongoose.model("Admin", adminSchema);

// Admin login route
app.post("/api/admin/login", async (req, res) => {
  const { email, password } = req.body;
  // console.log("Login attempt:", email, password);

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });
    // TEMPORARY plain-text check
    const isMatch = password === admin.password;
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    // ✅ Generate JWT token
    const token = jwt.sign(
      { id: admin._id, email: admin.email },
      process.env.JWT_SECRET,
      { expiresIn: "1h" } // Token valid for 1 hour
    );

    res.json({
      success: true,
      message: "Login successful",
      token, // Send token to frontend
    });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// ----------------- Blog schema -----------------
const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: String,
  image: String,
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active", // ✅ default should be Active if not passed
  },
  createdAt: { type: Date, default: Date.now },
});
const Blog = mongoose.model("Blog", blogSchema);

// ----------------- Category schema -----------------
const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: { type: String, required: true },
  caption: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ["Active", "Inactive"],
    default: "Active", // ✅ default should be Active if not passed
  },
});

const Category = mongoose.model("Category", categorySchema);

const auth = require("./middleware/auth");

// Add blog route (✅ protected)
app.post("/api/blogs", auth, async (req, res) => {
  try {
    const { title, content, category, image, status } = req.body;
    const validStatus = ["Active", "Inactive"];
    const blogStatus = validStatus.includes(status) ? status : "Active";

    const newBlog = new Blog({
      title,
      content,
      category,
      image,
      status: blogStatus,
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST /api/categories
app.post("/api/categories", auth, async (req, res) => {
  try {
    const { name, image, caption, status } = req.body;

    const validStatus = ["Active", "Inactive"];
    const categoryStatus = validStatus.includes(status) ? status : "Active";

    const newCategory = new Category({
      name,
      image,
      caption,
      status: categoryStatus,
    });

    await newCategory.save();
    res
      .status(201)
      .json({ message: "Category added successfully", newCategory });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error saving category", error: err.message });
  }
});

// ----------------- Get All Categories -----------------
app.get("/api/categories", async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ✅ Get single category by ID
app.get("/api/categories/:id", async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json(category);
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error fetching category", error: err.message });
  }
});

// ✅ Update category
app.put("/api/categories/:id", auth, async (req, res) => {
  try {
    const { name, image, caption, status } = req.body;

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, image, caption, status },
      { new: true } // return updated doc
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({
      message: "Category updated successfully",
      category: updatedCategory,
    });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error updating category", error: err.message });
  }
});

// Delete category route (protected)
app.delete("/api/categories/:id", auth, async (req, res) => {
  try {
    const category = await Category.findByIdAndDelete(req.params.id);
    if (!category)
      return res.status(404).json({ message: "Category not found" });
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

// Get all blogs
app.get("/api/blogs", async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get single blog by ID
app.get("/api/blogs/:id", async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update blog
app.put("/api/blogs/:id", auth, async (req, res) => {
  try {
    const { title, content, image, category, status } = req.body;
    // ✅ Debug: check incoming status
    console.log("Updating blog with status:", status);

    // ✅ Ensure status is valid
    const validStatus = ["Active", "Inactive"];
    const blogStatus = validStatus.includes(status) ? status : "Active";

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, image, category, status: blogStatus },
      { new: true, runValidators: true } // ✅ enforce enum validation
    );

    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ error: "Failed to update blog" });
  }
});

// Delete blog route (✅ protected)
app.delete("/api/blogs/:id", auth, async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) return res.status(404).json({ message: "Blog not found" });
    res.status(200).json({ message: "Blog deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
