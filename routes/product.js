const express = require("express");
const {
  create,
  productList,
  productListById,
  productDelete,
  productCount,
  productFeature,
} = require("../controller/product");
const router = express.Router();

router.get("/", productList);

router.post("/", create);

router.get("/:id", productListById);

router.delete("/:id", productDelete);

router.get("/count_product", productCount);

router.get("/feature_product", productFeature);

module.exports = router;
