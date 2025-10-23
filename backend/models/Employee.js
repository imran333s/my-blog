// models/Employee.js
const mongoose = require("mongoose");

const EmployeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  mobile: { type: String, required: true },
  password: { type: String, required: true },
  dob: { type: Date, required: true },
  role: { type: String, required: true }, // <-- change from ObjectId to String
  startDate: { type: Date, required: true },
  department: { type: String, required: true },
  reportingManager: { type: String },
});

module.exports = mongoose.model("Employee", EmployeeSchema);
