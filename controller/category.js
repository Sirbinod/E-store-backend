const Category = require("../models/category");

exports.create = async (req, res) => {
  const {name, color, icon} = req.body;
  try {
    const categoryExit = await Category.findOne({name: name});
    if (categoryExit) {
      return res
        .status(409)
        .json({success: false, message: "Category already exits"});
    } else {
      const category = new Category({name, color, icon});
      const newCategory = await category.save();
      res.status(201).json({
        success: true,
        message: "Category Create Successfull",
        data: newCategory,
      });
    }
  } catch (error) {
    res.status(500).json({success: false, error: error});
  }
};

exports.categoryList = async (req, res) => {
  try {
    const category = await Category.find();

    res.status(200).json({success: true, data: category});
  } catch (error) {
    res.status(404).json({success: false, error: error});
  }
};

exports.categoryListById = async (req, res) => {
  const _id = req.params.id;
  try {
    const category = await Category.findById(_id);
    if (!category) {
      res
        .status(404)
        .json({success: false, message: "Category not found given id"});
    } else {
      res.status(200).json({success: true, data: category});
    }
  } catch (error) {
    res.status(500).json({success: false, error: error});
  }
};

exports.categoryDelete = async (req, res) => {
  try {
    const _id = req.params.id;
    const categoryDel = await Category.findByIdAndDelete(_id);
    if (!_id) {
      res.status(404).json({success: false, message: "Category not found"});
    } else {
      res.status(200).json({
        success: true,
        message: "Category delete successfull",
        data: categoryDel,
      });
    }
  } catch (error) {
    res.status(400).json({success: false, error: error});
  }
};
