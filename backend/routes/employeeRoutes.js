const express = require("express");
const router = express.Router();
const {
  addEmployee,
  getEmployees,
  deleteEmployee,
  updateEmployee,
  getEmployeeById,
  loginEmployee,
} = require("../controllers/employeeController");


// ✅ Login route
router.post("/login", loginEmployee);

// Add employee
router.post("/add", addEmployee);

// Get all employees
router.get("/", getEmployees);

router.get("/:id", getEmployeeById);

// Delete employee
router.delete("/:id", deleteEmployee);

// Update employee
router.put("/:id", updateEmployee);

module.exports = router;
