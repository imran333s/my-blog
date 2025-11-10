const mongoose = require("mongoose");

const contactSettingsSchema = new mongoose.Schema({
  heroTitle: String,
  heroSubtitle: String,
  editorialEmail: String,
  adsEmail: String,
  correctionsEmail: String,
  officeAddress: String,
  heroBackgroundImage: { type: String, default: "" },
});

module.exports = mongoose.model("ContactSettings", contactSettingsSchema);
