const Category = require("../models/Category");

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// 🟢 Get a single category by ID
exports.getCategoryById = async (req, res) => {
  try {
    const category = await Category.findById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json(category);
  } catch (err) {
    res.status(500).json({
      message: "Failed to fetch category",
      error: err.message,
    });
  }
};

exports.addCategory = async (req, res) => {
  try {
    const { name, image, caption, status } = req.body;
    const validStatus = ["Active", "Inactive"];
    const categoryStatus = validStatus.includes(status) ? status : "Active";

    const newCategory = await Category.create({
      name,
      image,
      caption,
      status: categoryStatus,
    });

    res.status(201).json({ message: "Category added", newCategory });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Error saving category", error: err.message });
  }
};

// 🟢 Update an existing category
exports.updateCategory = async (req, res) => {
  try {
    const { name, image, caption, status } = req.body;
    const validStatus = ["Active", "Inactive"];
    const categoryStatus = validStatus.includes(status) ? status : "Active";

    const updatedCategory = await Category.findByIdAndUpdate(
      req.params.id,
      { name, image, caption, status: categoryStatus },
      { new: true } // return updated doc
    );

    if (!updatedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({
      message: "Category updated successfully",
      updatedCategory,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to update category",
      error: err.message,
    });
  }
};

// 🗑️ Delete a category
exports.deleteCategory = async (req, res) => {
  try {
    const deletedCategory = await Category.findByIdAndDelete(req.params.id);

    if (!deletedCategory) {
      return res.status(404).json({ message: "Category not found" });
    }

    res.json({ message: "Category deleted successfully" });
  } catch (err) {
    res.status(500).json({
      message: "Failed to delete category",
      error: err.message,
    });
  }
};
