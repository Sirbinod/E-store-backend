const express = require("express");
const {
  create,
  productList,
  productListById,
  productDelete,
  productCount,
  productFeature,
  productUpdate,
  productFilter,
} = require("../controller/product");
const router = express.Router();

router.get("/", productList);

router.post("/", create);

router.get("/:id", productListById);

router.delete("/:id", productDelete);

router.put("/:id", productUpdate);

router.get(`/get/count`, productCount);

router.get("/get/feature", productFeature);

module.exports = router;
