const express = require("express");
const {
  orderList,
  orderCreate,
  orderListById,
  orderDelete,
  orderUpdate,
} = require("../controller/order");
const router = express.Router();

router.get("/", orderList);

router.post("/", orderCreate);

router.get("/:id", orderListById);

router.delete("/:id", orderDelete);

router.put("/:id", orderUpdate);

module.exports = router;
