const express = require("express");
const router = express.Router();
const mysql = require("../mysql");

// [조회] landing page에 올라가는 keyword 호출하는 api
router.get("/landing", async (req, res) => {
  const keywordLanding = await mysql.query("keywordLanding");
  res.send(keywordLanding);
});

module.exports = router;
