const express = require("express");
const AboutSettings = require("../models/AboutSettings");
const router = express.Router();

router.get("/", async (req, res) => {
   
  try {
    let settings = await AboutSettings.findOne();
    if (!settings) {
      settings = await AboutSettings.create({
        heroTitle: "",
        heroSubtitle: "",
        section1Title: "",
        section1Text: "",
        section2Title: "",
        section2Text: "",
        section3Title: "",
        section3Text: "",
        heroBackgroundImage: "",
      });
    }
    res.json(settings);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.put("/", async (req, res) => {
  let settings = await AboutSettings.findOne();
  if (!settings) settings = new AboutSettings(req.body);
  else Object.assign(settings, req.body);

  await settings.save();
  res.json({ success: true, settings });
});

module.exports = router;
