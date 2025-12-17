const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    enum: ["super-admin", "admin", "manager", "employee"],
    default: "employee",
  },
  mobile: { type: String },
  dob: { type: Date }, // Date of Birth
  startDate: { type: Date }, // Start Date
  department: { type: String },
  reportingManager: { type: String }, // Reporting Manager
  status: { type: String, enum: ["active", "inactive"], default: "active" },
});

// 🔐 Hash password before saving
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

module.exports = mongoose.model("User", userSchema);
