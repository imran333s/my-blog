const express = require("express");
const Message = require("../models/Message"); // updated

const router = express.Router();

// Create a new message
router.post("/", async (req, res) => {
  try {
    const { name, email, message } = req.body;
    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    res.json({ success: true, message: "Message stored successfully" });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get all messages
router.get("/", async (req, res) => {
  try {
    const messages = await Message.find().sort({ createdAt: -1 });
    res.json(messages);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
