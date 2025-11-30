const Department = require("../models/Department");

// Get all departments
exports.getAllDepartments = async (req, res) => {
  try {
    const depts = await Department.find();
    res.json(depts);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Add department
exports.addDepartment = async (req, res) => {
  try {
    const { name, status } = req.body;

    const newDept = await Department.create({
      name,
      status: status || "Active",
    });

    res.status(201).json({ message: "Department added", newDept });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update department
exports.updateDepartment = async (req, res) => {
  try {
    const { name, status } = req.body;

    const updatedDept = await Department.findByIdAndUpdate(
      req.params.id,
      { name, status },
      { new: true }
    );

    res.json({ message: "Department updated", updatedDept });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete department
exports.deleteDepartment = async (req, res) => {
  try {
    await Department.findByIdAndDelete(req.params.id);
    res.json({ message: "Department deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
