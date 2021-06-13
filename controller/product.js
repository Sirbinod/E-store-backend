const Product = require("../models/product");

exports.create = async (req, res) => {
  const {
    name,
    shortName,
    description,
    image,
    gallery,
    brand,
    price,
    category,
    stock,
    rating,
    review,
    isFeatured,
  } = req.body;
  try {
    const productExit = await Product.findOne({name: name});
    if (productExit) {
      return res
        .status(409)
        .json({success: false, message: "Product already exits"});
    } else {
      const product = new Product(
        name,
        shortName,
        description,
        image,
        gallery,
        brand,
        price,
        category,
        stock,
        rating,
        review,
        isFeatured
      );
      const newProduct = await product.save();
      res.status(201).json({
        success: true,
        message: "Product Create Successfull",
        data: newProduct,
      });
    }
  } catch (error) {
    res.status(500).json({success: false, error: error});
  }
};

exports.productList = async (req, res) => {
  try {
    const product = await Product.find();
    res.status(200).json({success: true, data: product});
  } catch (error) {
    res.status(500).json({success: false, error: error});
  }
};

exports.productListById = async (req, res) => {
  const _id = req.params.id;
  try {
    const product = await Product.findById(_id);
    if (!product) {
      res
        .status(404)
        .json({success: false, message: "Product not found given id"});
    } else {
      res.status(500).json({success: true, data: product});
    }
  } catch (error) {
    res.status(500).json({success: false, error: error});
  }
};

exports.productDelete = async (req, res) => {
  const _id = req.params.id;
  try {
    const produtDel = await Product.findByIdAndDelete(_id);
    if (_id) {
      res.status(404).json({success: false, message: "Product not found"});
    } else {
      res.status(200).json({
        success: true,
        message: "Product delete successfull",
        data: produtDel,
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error,
    });
  }
};

exports.productCount = async (req, res) => {
  try {
    const countProd = await Product.countDocuments((count) => count);
    res.status(200).json({success: true, data: countProd});
  } catch (error) {
    res.status(500).json({success: false, error: error});
  }
};

exports.productFeature = async (req, res) => {
  try {
    const featureProd = await Product.find({isFeatured: true});
    res.status(200).json({success: true, data: featureProd});
  } catch (error) {
    res.status(500).json({success: false, error: error});
  }
};
