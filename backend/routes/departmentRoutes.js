const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const {
  getAllDepartments,
  addDepartment,
  updateDepartment,
  deleteDepartment,
} = require("../controllers/departmentController");

router.get("/", getAllDepartments);
router.post("/add", auth, addDepartment);
router.put("/update/:id", auth, updateDepartment);
router.delete("/delete/:id", auth, deleteDepartment);

module.exports = router;
