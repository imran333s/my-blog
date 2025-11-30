const mongoose = require("mongoose");

const blogSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: String,
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true,
  },
  subcategory: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Subcategory",
    required: false, // explicitly optional
    default: null, // default to null if nothing is sent
  },
  image: String,
  status: { type: String, enum: ["Active", "Inactive"], default: "Active" },
  videoLink: String,
  createdAt: { type: Date, default: Date.now },
});

blogSchema.index({ title: "text", content: "text" });

module.exports = mongoose.model("Blog", blogSchema);
