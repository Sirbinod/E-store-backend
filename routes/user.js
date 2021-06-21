const express = require("express");
const {
  userList,
  userCreate,
  userListById,
  userLogin,
  userDelete,
  userCount,
  userUpdate,
} = require("../controller/user");
const router = express.Router();

router.get("/", userList);

router.post("/", userCreate);

router.get("/:id", userListById);

router.delete("/:id", userDelete);

router.put("/:id", userUpdate);

router.get("/get/count", userCount);

router.post("/login", userLogin);

module.exports = router;
