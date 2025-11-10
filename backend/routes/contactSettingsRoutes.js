const express = require("express");
const ContactSettings = require("../models/ContactSettings");
const router = express.Router();
router.get("/", async (req, res) => {
  try {
    let settings = await ContactSettings.findOne();

    // ✅ If does not exist, create with empty string defaults
    if (!settings) {
      settings = await ContactSettings.create({
        heroTitle: "",
        heroSubtitle: "",
        editorialEmail: "",
        adsEmail: "",
        correctionsEmail: "",
        officeAddress: "",
      });
    }

    return res.json(settings);
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

// ✅ Save (Create/Update)
router.put("/", async (req, res) => {
  const data = req.body;
  let settings = await ContactSettings.findOne();

  if (!settings) settings = new ContactSettings(data);
  else Object.assign(settings, data);

  await settings.save();
  return res.json({ success: true, settings });
});

module.exports = router;
