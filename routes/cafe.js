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
  const cafeDetail = await mysql.query("cafeDetail", cafe_id);
  const temp = [];
  const cafeBrewingOption = await mysql.query("cafeBrewingOption", cafe_id);
  cafeBrewingOption.forEach((key) => {
    // console.log(key);
    temp.push(key);
  });

  cafeDetail[0].brewingOption = temp;
  // console.log(temp);
  // console.log(cafeDetail);
  res.send(cafeDetail);
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
