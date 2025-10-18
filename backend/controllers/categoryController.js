const Category = require("../models/Category");

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find();
    res.json(categories);
  } catch (err) {
    res.status(500).json({ error: err.message });
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
    res.status(500).json({ message: "Error saving category", error: err.message });
  }
};
