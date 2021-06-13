const express = require("express");
const router = express.Router();

const {
  create,
  categoryList,
  categoryDelete,
  categoryListById,
  categoryUpdate,
} = require("../controller/category");

//router
router.post("/", create);

router.get("/", categoryList);

router.get("/:id", categoryListById);

router.delete("/:id", categoryDelete);

router.put("/:id", categoryUpdate);

module.exports = router;
