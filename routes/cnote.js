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

/////// 커핑노트 등록 시 필요한 api ////////
// [조회] 일반 카페 목록 api
router.get("/", async (req, res) => {
  const cafeListOnly = await mysql.query("cafeListOnly");
  res.send(cafeListOnly);
});

// [조회] 유저 아이디로 마이카페리스트 이름 조회 api
router.get("/mycafelist/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const cnoteMyList = await mysql.query("cnoteMyList", user_id);
  res.json(cnoteMyList);
});

// [조회] 마이 카페리스트 체크해서 카페 이름 부르기 api
router.get("/mycafelist/:cafe_id", async (req, res) => {
  const { user_id } = req.params;
  const cnoteMylist = await mysql.query("cnoteMylist", user_id);
  res.send(cnoteMylist);
});

// [생성] cnote 테이블에 일반정보 저장 api

// [업데이트] cnote id 생성 후 cafe id들 저장 업데이트 api

module.exports = router;
