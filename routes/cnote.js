const express = require("express");
const router = express.Router();
const mysql = require("../mysql");

// [조회] 커핑노트 내부 호출하는 api 1
router.get("/detail/:cnote_id", async (req, res) => {
  const { cnote_id } = req.params;
  const cnoteDetail = await mysql.query("cnoteDetail", cnote_id);
  res.send(cnoteDetail);
});

// [조회] 커핑노트 이미지 호출하는 api 2
router.get("/img/:cnote_id", async (req, res) => {
  const { cnote_id } = req.params;
  const cnoteImg = await mysql.query("cnoteImg", cnote_id);
  res.send(cnoteImg);
});

// [조회] 커핑노트 사용자 카드 호출하는 api 3.
router.get("/user/:cnote_id", async (req, res) => {
  const { cnote_id } = req.params;
  const cnoteUser = await mysql.query("cnoteUser", cnote_id);
  res.send(cnoteUser);
});

module.exports = router;
