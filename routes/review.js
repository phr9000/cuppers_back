const express = require("express");
const router = express.Router();
const mysql = require("../mysql");

// [조회] 선택된 카페의 review 불러오는 api
router.get("/:cafe_id", async (req, res) => {
  const { cafe_id } = req.params;
  const cafeReview = await mysql.query("cafeReview", cafe_id);
  const reviewKeyword = await mysql.query("reviewKeyword", cafe_id);

  cafeReview.forEach((review) => {
    const temp_id = review.review_id;
    review.review_keyword = [];
    reviewKeyword.filter((obj) => obj.review_id === temp_id);
  });

  res.send(cafeReview);
});

module.exports = router;
