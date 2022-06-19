const express = require("express");
const router = express.Router();
const mysql = require("../mysql");

// [조회] cafe 리스트
router.get("/", async (req, res) => {
  const searchParam = "%" + req.query.region + "%";
  const cafeList = await mysql.query("cafeList", searchParam);
  // 조회 조건에 맞춰 카페 테이블의 데이터 불러오는 쿼리(LIMIT 10)

  const cafeListKeyword = await mysql.query("cafeListKeyword", searchParam);
  // 조회 조건에 맞춘 카페 데이터와 연결된 키워드만 호출
  const cafeListOpTime = await mysql.query("cafeListOpTime", searchParam);
  // 조회 조건에 맞춘 카페 데이터와 연결된 영업시간만 호출

  cafeList.forEach((cafe) => {
    const temp_id = cafe.cafe_id;
    cafe.cafe_keyword = cafeListKeyword.filter(
      (obj) => obj.cafe_id === temp_id
    );
  });
  // 카페 object 내에 키워드 object들을 배열로 추가

  cafeList.forEach((cafe) => {
    const temp_id = cafe.cafe_id;
    cafe.cafe_opTime = cafeListOpTime.filter((obj) => obj.cafe_id === temp_id);
  });

  res.send(cafeList);
});

// [조회] cafe 상세페이지1 - cafe 기본 정보
router.get("/:cafe_id", async (req, res) => {
  const { cafe_id } = req.params;
  const user_id = req.query.user_id;
  // cafe 테이블의 데이터 호출
  const cafeDetail = await mysql.query("cafeDetail", [
    cafe_id,
    user_id,
    cafe_id,
    user_id,
    cafe_id,
    cafe_id,
  ]);

  const cafeBrewingOption = await mysql.query("cafeBrewingOption", cafe_id);

  const cafeOpTime = await mysql.query("cafeOpTime", cafe_id);

  const cafeKeyword = await mysql.query("cafeKeyword", cafe_id);

  const cafeMenu = await mysql.query("cafeMenu", cafe_id);

  const cafeFacility = await mysql.query("cafeFacility", cafe_id);

  cafeDetail[0].brewingOption = cafeBrewingOption;
  cafeDetail[0].opTime = cafeOpTime;
  cafeDetail[0].keyword = cafeKeyword;
  cafeDetail[0].menu = cafeMenu;
  cafeDetail[0].facility = cafeFacility;

  res.send(cafeDetail[0]);
});

// [조회] cafe 상세페이지2 - cafe images
router.get("/image/:cafe_id", async (req, res) => {
  const { cafe_id } = req.params;
  const cafeImage = await mysql.query("cafeImage", cafe_id);

  res.send(cafeImage);
});

// router.get("/update", async (req, res) => {
//     const cafeList = await mysql.query("cafeList");
//     res.send(cafeList);
// });

// app.get("/api/cafe", async (req, res) => {
//     const cafeList = await mysql.query("cafeList");
//     res.send(cafeList);
//   });

module.exports = router;
