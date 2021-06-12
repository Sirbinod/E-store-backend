const express = require("express");
const router = express.Router();

router.get("/", (req, res) => {
  res.send("Hello world day 2");
});
module.exports = router;
