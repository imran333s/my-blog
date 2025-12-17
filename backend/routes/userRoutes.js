const express = require("express");
const router = express.Router();
const auth = require("../middleware/auth");
const allowRoles = require("../middleware/allowRoles");
const {
  createUser,
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
} = require("../controllers/userManagementController");

// Admin & Super Admin can create/update/delete users
router.post("/", auth, allowRoles("admin", "super-admin"), createUser);
router.put("/:id", auth, allowRoles("admin", "super-admin"), updateUser);
router.delete("/:id", auth, allowRoles("admin", "super-admin"), deleteUser);

// Admin/Manager/Super Admin can view users
router.get("/", auth, allowRoles("admin", "super-admin", "manager"), getUsers);
router.get("/:id", auth, allowRoles("admin", "super-admin", "manager"), getUserById);

module.exports = router;
