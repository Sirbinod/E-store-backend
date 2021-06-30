const Product = require("../models/product");
const Category = require("../models/category");
// const mongoose = require("mongoose");
const multer = require("multer");

const FILE_TYPE_MAP = {
  "image/png": "png",
  "image/jpeg": "jpeg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error("invalid image type");
    if (isValid) {
      uploadError = null;
    }
    cb(uploadError, "public/upload");
  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.split(" ").join("-");
    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}-${Date.now()}.${extension}`);
  },
});

exports.uploadOptions = multer({storage: storage});

exports.create = async (req, res) => {
  const category = await Category.findById(req.body.category);
  console.log(category);
  if (!category) return res.status(404).send("invalid category");

  const file = req.file;
  if (!file) return res.status(400).send("No image in the request");
  const fileName = file.filename;
  const basePath = `${req.protocol}://${req.get("host")}/public/-upload/`;
  try {
    const productExit = await Product.findOne({name: req.body.name});
    if (productExit) {
      return res
        .status(409)
        .json({success: false, message: "Product already exits"});
    } else {
      let product = new Product({
        name: req.body.name,
        shortName: req.body.shortName,
        description: req.body.description,
        image: `${basePath}${fileName}`,
        gallery: req.body.gallery,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        stock: req.body.stock,
        rating: req.body.rating,
        review: req.body.review,
        isFeatured: req.body.isFeatured,
      });
      const newProduct = await product.save();
      res.status(201).json({
        success: true,
        message: "Product Create Successfull",
        data: newProduct,
      });
    }
  } catch (error) {
    res.status(500).json({success: false, error: error});
    console.log(error);
  }
};

exports.productList = async (req, res) => {
  let filter = {};
  if (req.query.categories) {
    filter = {category: req.query.categories.split(",")};
  }
  try {
    const product = await Product.find(filter).populate("category");
    res
      .status(200)
      .json({success: true, message: "product list succesfull", data: product});
  } catch (error) {
    res.status(500).json({success: false, error: error});
  }
};

exports.productListById = async (req, res) => {
  const _id = req.params.id;
  try {
    const product = await Product.findById(_id).populate("category");
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
    if (!_id) {
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
exports.productUpdate = async (req, res) => {
  try {
    const _id = req.params.id;
    const product = await Product.findByIdAndUpdate(
      _id,
      {
        name: req.body.name,
        shortName: req.body.shortName,
        description: req.body.description,
        image: req.body.image,
        gallery: req.body.gallery,
        brand: req.body.brand,
        price: req.body.price,
        category: req.body.category,
        stock: req.body.stock,
        rating: req.body.rating,
        review: req.body.review,
        isFeatured: req.body.isFeatured,
      },
      {new: true}
    );
    if (!product) {
      return res.status(400).json({success: false, message: "Invalid Product"});
    } else {
      res.status(201).json({
        success: true,
        message: "Product update successfull",
        product,
      });
    }
  } catch (error) {
    res.status(500).json({success: false, error: error});
  }
};

exports.productCount = async (req, res) => {
  try {
    const countProd = await Product.countDocuments((count) => count);
    if (!countProd) {
      res.status(400).json({success: false, message: "product none"});
    }
    res.status(200).json({success: true, count: countProd});
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

exports.productFilter = async (req, res) => {
  try {
    const count = req.params.count ? req.params.count : 0;
    const products = await Product.find({isFeatured: true}).limit(+count);
    res.send(products);
  } catch (error) {
    res.status(500).json({success: false, meassage: error});
  }
};
