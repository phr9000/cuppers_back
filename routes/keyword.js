const express = require("express");
const router = express.Router();
const mysql = require("../mysql");

// [조회] landing page에 올라가는 keyword 호출하는 api
router.get("/landing", async (req, res) => {
  const keywordLanding = await mysql.query("keywordLanding");
  res.send(keywordLanding);
});

// [생성] keyword 추가 api
router.post("/", async (req, res) => {
  const result = await mysql.query("keywordCreate", req.body.param);
  res.send(result);
});

module.exports = router;
