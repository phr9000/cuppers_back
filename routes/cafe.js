const express = require("express");
const router = express.Router();
const mysql = require("../mysql");

// [조회] cafe 리스트
router.get("/", async (req, res) => {
  const cafeList = await mysql.query("cafeList");
  // 카페 테이블의 데이터 불러오는 쿼리(LIMIT 10)

  const cafeListKeyword = await mysql.query("cafeListKeyword");
  // 카페 테이블 데이터와 연결된 다른 테이블의 데이터 불러오는 쿼리 (아래는 쿼리문)
  // cafeListKeyword: `SELECT t1.cafe_id, t3.keyword_id, t3.keyword_name
  // FROM cafe t1, cafe_keyword t2, keyword t3
  // WHERE t1.cafe_id = t2.cafe_id and t2.keyword_id = t3.keyword_id`

  // -> 연결된 테이블 정보 가져오는 두번째 쿼리는 LIMIT을 걸 수 없음
  // (카페 데이터 하나 당 몇 개의 키워드 데이터가 join되었는지 모름)

  const cafeListOpTime = await mysql.query("cafeListOpTime");

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
  // cafe 테이블의 데이터 호출
  const cafeDetail = await mysql.query("cafeDetail", cafe_id);

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
