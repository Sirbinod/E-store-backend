const express = require("express");
const router = express.Router();

const {
  create,
  categoryList,
  categoryDelete,
  categoryListById,
} = require("../controller/category");

//router
router.post("/", create);

router.get("/", categoryList);

router.get("/:id", categoryListById);

router.delete("/:id", categoryDelete);

module.exports = router;
