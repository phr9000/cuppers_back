const express = require("express");
const router = express.Router();
const mysql = require("../mysql");

// [조회] cafe 테이블의 모든 데이터
router.get("/", async (req, res) => {
  const cafeList = await mysql.query("cafeList");
  res.send(cafeList);
});

// [조회] front가 요청한 cafe_id의 cafe 상세 정보
router.get("/:cafe_id", async (req, res) => {
  const { cafe_id } = req.params;
  // cafe 테이블의 데이터 호출
  const cafeDetail = await mysql.query("cafeDetail", cafe_id);

  // 연결된 테이블들의 데이터를 받아서 배열로 object에 삽입
  const images = [];
  const brewingOptions = [];
  const operationTimes = [];
  const keywords = [];
  const menus = [];
  const facilities = [];

  const cafeImage = await mysql.query("cafeImage", cafe_id);
  cafeImage.forEach((key) => {
    images.push(key);
  });

  const cafeBrewingOption = await mysql.query("cafeBrewingOption", cafe_id);
  cafeBrewingOption.forEach((key) => {
    brewingOptions.push(key);
  });

  const cafeOperationTime = await mysql.query("cafeOperationTime", cafe_id);
  cafeOperationTime.forEach((key) => {
    operationTimes.push(key);
  });

  const cafeKeyword = await mysql.query("cafeKeyword", cafe_id);
  cafeKeyword.forEach((key) => {
    keywords.push(key);
  });

  const cafeMenu = await mysql.query("cafeMenu", cafe_id);
  cafeMenu.forEach((key) => {
    menus.push(key);
  });

  const cafeFacility = await mysql.query("cafeFacility", cafe_id);
  cafeFacility.forEach((key) => {
    facilities.push(key);
  });

  cafeDetail[0].image = images;
  cafeDetail[0].brewingOption = brewingOptions;
  cafeDetail[0].operationTime = operationTimes;
  cafeDetail[0].keyword = keywords;
  cafeDetail[0].menu = menus;
  cafeDetail[0].facility = facilities;

  const likeIt = await mysql.query("cafeLikeIt", cafe_id);
  cafeDetail[0].likeIt = likeIt[0];

  res.send(cafeDetail[0]);
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
