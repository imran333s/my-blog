const express = require("express");
const router = express.Router();
const subCtrl = require("../controllers/subcategoryController");
const auth = require("../middleware/auth");

router.get("/", subCtrl.getSubcategories);
router.post("/", auth, subCtrl.createSubcategory);
router.delete("/:id", auth, subCtrl.deleteSubcategory);

module.exports = router;
