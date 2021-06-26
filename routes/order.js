const express = require("express");
const {
  orderList,
  orderCreate,
  orderListById,
  orderDelete,
  orderUpdate,
  totalSales,
  orderCount,
} = require("../controller/order");
const router = express.Router();

router.get("/", orderList);

router.post("/", orderCreate);

router.get("/:id", orderListById);

router.delete("/:id", orderDelete);

router.put("/:id", orderUpdate);

router.get("/get/totalSale", totalSales);

router.get("/get/count", orderCount);

module.exports = router;
