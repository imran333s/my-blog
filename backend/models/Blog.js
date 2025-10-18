// models/Blog.js
const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: String,
  content: String,
  category: String,
  image: String,
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  videoLink: String,
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Blog", blogSchema);
