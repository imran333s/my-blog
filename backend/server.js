// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// const bodyParser = require("body-parser");

// const app = express();
// app.use(cors());
// app.use(bodyParser.json());

// // Connect to MongoDB Atlas
// mongoose
//   .connect(
//     "mongodb+srv://imran33s786_db_user:sahrukh%40333@cluster0.x5uaw0d.mongodb.net/my-blog-app?retryWrites=true&w=majority",
//     { useNewUrlParser: true, useUnifiedTopology: true }
//   )
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.log(err));

// // ----------------- Admin schema -----------------
// const adminSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
//   password: { type: String, required: true },
// });

// const Admin = mongoose.model("Admin", adminSchema);

// // Admin login route
// app.post("/api/admin/login", async (req, res) => {
//   const { email, password } = req.body;

//   try {
//     const admin = await Admin.findOne({ email });
//     if (!admin) return res.status(401).json({ message: "Invalid credentials" });

//     // Simple password check (replace with bcrypt in production)
//     if (password !== admin.password) {
//       return res.status(401).json({ message: "Invalid credentials" });
//     }

//     res.json({ success: true });
//   } catch (err) {
//     res.status(500).json({ message: "Server error" });
//   }
// });

// // ----------------- Blog schema -----------------
// const blogSchema = new mongoose.Schema({
//   title: String,
//   content: String,
//   category: String, // category field
//   image: String,
//   createdAt: { type: Date, default: Date.now },
// });

// const Blog = mongoose.model("Blog", blogSchema);

// // Add blog route
// app.post("/api/blogs", async (req, res) => {
//   try {
//     const { title, content, category, image } = req.body;
//     const newBlog = new Blog({ title, content, category, image });
//     await newBlog.save();
//     res.status(201).json(newBlog);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get all blogs
// app.get("/api/blogs", async (req, res) => {
//   try {
//     const blogs = await Blog.find();
//     res.json(blogs);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Get single blog by ID
// app.get("/api/blogs/:id", async (req, res) => {
//   try {
//     const blog = await Blog.findById(req.params.id);
//     if (!blog) return res.status(404).json({ message: "Blog not found" });
//     res.json(blog);
//   } catch (err) {
//     res.status(500).json({ error: err.message });
//   }
// });

// // Update blog (now includes category)
// app.put("/api/blogs/:id", async (req, res) => {
//   try {
//     const { title, content, image, category } = req.body; // include category
//     const updatedBlog = await Blog.findByIdAndUpdate(
//       req.params.id,
//       { title, content, image, category },
//       { new: true } // return updated blog
//     );
//     res.json(updatedBlog);
//   } catch (err) {
//     res.status(500).json({ error: "Failed to update blog" });
//   }
// });

// // Delete blog
// app.delete("/api/blogs/:id", async (req, res) => {
//   try {
//     const blog = await Blog.findByIdAndDelete(req.params.id);
//     if (!blog) return res.status(404).json({ message: "Blog not found" });
//     res.status(200).json({ message: "Blog deleted" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
// server.js
require("dotenv").config(); // Load environment variables

const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

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

  try {
    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(401).json({ message: "Invalid credentials" });

    // Simple password check (replace with bcrypt in production)
    if (password !== admin.password) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    res.json({ success: true });
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
  createdAt: { type: Date, default: Date.now },
});

const Blog = mongoose.model("Blog", blogSchema);

// Add blog route
app.post("/api/blogs", async (req, res) => {
  try {
    const { title, content, category, image } = req.body;
    const newBlog = new Blog({ title, content, category, image });
    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
app.put("/api/blogs/:id", async (req, res) => {
  try {
    const { title, content, image, category } = req.body;
    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { title, content, image, category },
      { new: true }
    );
    res.json(updatedBlog);
  } catch (err) {
    res.status(500).json({ error: "Failed to update blog" });
  }
});

// Delete blog
app.delete("/api/blogs/:id", async (req, res) => {
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
