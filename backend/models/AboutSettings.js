const mongoose = require("mongoose");

const aboutSettingsSchema = new mongoose.Schema({
  heroTitle: String,
  heroSubtitle: String,
  section1Title: String,
  section1Text: String,
  section2Title: String,
  section2Text: String,
  section3Title: String,
  section3Text: String,
  heroBackgroundImage: { type: String, default: "" },
});

module.exports = mongoose.model("AboutSettings", aboutSettingsSchema);
