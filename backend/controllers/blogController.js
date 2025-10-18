const Blog = require("../models/Blog");

exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.addBlog = async (req, res) => {
  try {
    const { title, content, category, image, status, videoLink } = req.body;
    const validStatus = ["Active", "Inactive"];
    const blogStatus = validStatus.includes(status) ? status : "Active";

    const newBlog = await Blog.create({
      title,
      content,
      category,
      image,
      status: blogStatus,
      videoLink,
    });

    res.status(201).json(newBlog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const validStatus = ["Active", "Inactive"];
    const blogStatus = validStatus.includes(req.body.status)
      ? req.body.status
      : "Active";

    const updatedBlog = await Blog.findByIdAndUpdate(
      req.params.id,
      { ...req.body, status: blogStatus },
      { new: true }
    );

    if (!updatedBlog)
      return res.status(404).json({ message: "Blog not found" });

    res.json(updatedBlog);
  } catch {
    res.status(500).json({ message: "Failed to update blog" });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const deleted = await Blog.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "Blog not found" });
    res.json({ message: "Blog deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
