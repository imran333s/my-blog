const express = require("express");
const PublicFeedback = require("../models/PublicFeedback"); // your model

const router = express.Router();

// Create new public feedback
router.post("/", async (req, res) => {
  try {
    const { name, email, category, rating, message } = req.body;

    const newFeedback = new PublicFeedback({
      name: name || "Anonymous",
      email,
      category,
      rating,
      message,
    });

    await newFeedback.save();

    res.status(201).json({ success: true, feedback: newFeedback });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all public feedback (for display)
router.get("/", async (req, res) => {
  try {
    const feedbacks = await PublicFeedback.find().sort({ createdAt: -1 });
    res.json(feedbacks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
