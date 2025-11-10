const mongoose = require("mongoose");

const PublicFeedbackSchema = new mongoose.Schema({
  name: { type: String, default: "Anonymous" },

  email: { 
    type: String,
    trim: true,
    lowercase: true,
    default: null
  },

  category: {
    type: String,
    enum: ["website", "accuracy", "suggestion", "issue", "general"],
    required: true,
  },

  rating: {
    type: Number,
    min: 0,
    max: 5,
    default: 0,
  },

  message: { 
    type: String, 
    required: true,
    trim: true
  },

  createdAt: { 
    type: Date, 
    default: Date.now 
  },
});

module.exports = mongoose.model("PublicFeedback", PublicFeedbackSchema);
