// controllers/employeeController.js
const Employee = require("../models/Employee");
const jwt = require("jsonwebtoken");

exports.loginEmployee = async (req, res) => {
  const { email, password } = req.body;
  try {
    const employee = await Employee.findOne({ email });
    if (!employee || employee.password !== password)
      return res.status(401).json({ message: "Invalid credentials" });

    // ✅ Create JWT with role and type
    const token = jwt.sign(
      {
        id: employee._id,
        name: employee.name,
        email: employee.email,
        role: "Employee",   // 👈 Role for access control
        type: "employee",   // 👈 Type (optional but useful)
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({ success: true, message: "Login successful", token });
  } catch (error) {
    console.error("Error during employee login:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};


// Add new employee
exports.addEmployee = async (req, res) => {
  try {
    const employee = new Employee(req.body);
    await employee.save();
    res.status(201).json({ message: "Employee added successfully", employee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to add employee", error: err.message });
  }
};

// Get all employees
exports.getEmployees = async (req, res) => {
  try {
    const employees = await Employee.find();
    res.status(200).json(employees);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch employees", error: err.message });
  }
};

// Get single employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const employee = await Employee.findById(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json(employee);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch employee", error: err.message });
  }
};


// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee updated successfully", employee });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to update employee", error: err.message });
  }
};


// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);
    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }
    res.status(200).json({ message: "Employee deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to delete employee", error: err.message });
  }
};

