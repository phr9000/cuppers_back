const express = require("express");
const router = express.Router();
const mysql = require("../mysql");

router.get("/", async (req, res) => {
  const userList = await mysql.query("userList");
  res.send(userList);
});

//
router.post("/", async (req, res) => {
  const result = await mysql.query("userCreate", req.body.param);
  res.send(result);
});

module.exports = router;
