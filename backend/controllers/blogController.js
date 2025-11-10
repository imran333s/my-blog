const Blog = require("../models/Blog");
const mongoose = require("mongoose");
exports.getAllBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find();
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get a single blog by ID
exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) {
      return res.status(404).json({ message: "Blog not found" });
    }
    res.json(blog);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

//for frontend news
exports.getPaginatedBlogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 6;
    const skip = (page - 1) * limit;

    const category = req.query.category || "all";

    let query = { status: { $regex: /^active$/i } };

    if (category !== "all") {
      query.category = { $regex: new RegExp(`^${category}$`, "i") }; // ✅ exact match, no duplicates
    }

    const blogs = await Blog.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

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

// ✅ Get similar blogs by category + keyword
exports.getSimilarBlogs = async (req, res) => {
  try {
    const { id } = req.params;
    const currentBlog = await Blog.findById(id);

    if (!currentBlog) {
      return res.status(404).json({ message: "Blog not found" });
    }

    const { category, title, content } = currentBlog;

    // Extract key terms from title + content
    const text = `${title} ${content}`;

    const keywords =
      text
        .toLowerCase()
        .match(/\b[a-z]{4,}\b/g) // words with 4+ letters
        ?.slice(0, 10) || [];

    const keywordRegex = keywords.length
      ? { $regex: keywords.join("|"), $options: "i" }
      : null;

    // Query blogs with same category + matching keywords
    const query = {
      _id: { $ne: currentBlog._id }, // exclude current blog
      status: "Active",
      category,
      ...(keywordRegex && {
        $or: [{ title: keywordRegex }, { content: keywordRegex }],
      }),
    };

    let similarBlogs = await Blog.find(query).sort({ createdAt: -1 }).limit(4); // ✅ max 4 blogs

    // Remove duplicates by _id just in case
    similarBlogs = Array.from(
      new Map(similarBlogs.map((b) => [b._id, b])).values()
    );

    res.json(similarBlogs); // send whatever is available, up to 4
  } catch (err) {
    console.error("Error fetching similar blogs:", err);
    res.status(500).json({ message: "Failed to fetch similar blogs" });
  }
};

// ✅ Get last 5 recently added active blogs (Trending)
exports.getTrendingBlogs = async (req, res) => {
  try {
    const trending = await Blog.find({ status: "Active" })
      .sort({ createdAt: -1 }) // newest first
      .limit(4); // show last 5 added

    res.status(200).json(trending);
  } catch (err) {
    console.error("❌ Error fetching trending blogs:", err);
    res.status(500).json({ message: "Failed to fetch trending blogs" });
  }
};

exports.searchBlogs = async (req, res) => {
  try {
    const query = req.query.q;

    const blogs = await Blog.find(
      {
        status: "Active",
        $text: { $search: query },
      },
      {
        score: { $meta: "textScore" },
      }
    ).sort({ score: { $meta: "textScore" } });

    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: "Search failed" });
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
