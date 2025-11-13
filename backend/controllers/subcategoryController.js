const Subcategory = require("../models/Subcategory");

// ✅ Create Subcategory
exports.createSubcategory = async (req, res) => {
  try {
    const { name, category, status } = req.body;

    if (!name || !category) {
      return res
        .status(400)
        .json({ message: "Name and category are required" });
    }

    const subcategory = new Subcategory({
      name,
      category,
      status: status || "Active",
    });

    const saved = await subcategory.save();
    res.status(201).json(saved);
  } catch (error) {
    console.error("Create subcategory error:", error);
    res.status(500).json({ message: "Failed to create subcategory" });
  }
};

// ✅ Get all Subcategories (optionally by category)
exports.getSubcategories = async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};
    const subcategories = await Subcategory.find(filter).populate(
      "category",
      "name"
    );
    res.status(200).json(subcategories);
  } catch (error) {
    res.status(500).json({ message: "Error fetching subcategories", error });
  }
};

// ✅ Delete Subcategory
exports.deleteSubcategory = async (req, res) => {
  try {
    const deleted = await Subcategory.findByIdAndDelete(req.params.id);
    if (!deleted)
      return res.status(404).json({ message: "Subcategory not found" });

    res.status(200).json({ message: "Subcategory deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete subcategory", error });
  }
};
