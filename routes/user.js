const express = require("express");
const router = express.Router();
const mysql = require("../mysql");

router.get("/", async (req, res) => {
  //   const cafeList = await mysql.query("cafeList");
  //   res.send(cafeList);
});

module.exports = router;
