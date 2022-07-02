const express = require("express");
const router = express.Router();
const mysql = require("../mysql");
const sql = require("../mysql/sql");
const { cafeDetail } = require("../mysql/sql");

// [조회] cafe 리스트
router.get("/", async (req, res) => {
  const user_id = req.query.user;
  const searchParam = "%" + req.query.search + "%";
  const minLat = req.query.lat_min;
  const maxLat = req.query.lat_max;
  const minLong = req.query.long_min;
  const maxLong = req.query.long_max;
  const curLat = req.query.current_lat;
  const curLong = req.query.current_long;

  const cafeList = await mysql.query("cafeList", [
    Number(curLat),
    Number(curLong),
    user_id,
    user_id,
    searchParam,
    searchParam,
    searchParam,
    minLat,
    maxLat,
    minLong,
    maxLong,
  ]);
  // 조회 조건에 맞춰 카페 테이블의 데이터 불러오는 쿼리(LIMIT 10)

  const cafeListKeyword = await mysql.query("cafeListKeyword", searchParam);
  // 조회 조건에 맞춘 카페 데이터와 연결된 키워드만 호출
  const cafeListOpTime = await mysql.query("cafeListOpTime", searchParam);
  // 조회 조건에 맞춘 카페 데이터와 연결된 영업시간만 호출

  cafeList.forEach((cafe) => {
    const temp_id = cafe.cafe_id;
    cafe.keywords = cafeListKeyword.filter((obj) => obj.cafe_id === temp_id);
    cafe.opTime = cafeListOpTime.filter((obj) => obj.cafe_id === temp_id);
  });
  // 카페 object 내에 키워드, 영업시간 object들을 배열로 추가

  res.send(cafeList);
});

// [조회] cafe 상세페이지1 - cafe 기본 정보
router.get("/:cafe_id", async (req, res) => {
  const { cafe_id } = req.params;
  const user_id = req.query.user_id;
  // cafe 테이블의 데이터 호출
  const cafeDetail = await mysql
    .query("cafeDetail", [
      cafe_id,
      cafe_id,
      cafe_id,
      user_id,
      cafe_id,
      user_id,
      cafe_id,
      cafe_id,
    ])
    .then(async (result) => {
      delete result[0].cafe_view;
      delete result[0].cafe_status;
      delete result[0].is_headquater;
      let headquater_id = result[0].headquater_id;
      const cafeBranches = await mysql.query("cafeBranches", headquater_id);
      delete result[0].headquater_id;
      delete result[0].cafe_sns;
      delete result[0].user_id;
      delete result[0].cafe_reg_num;
      delete result[0].cafe_reg_pic;
      delete result[0].cafe_email;
      delete result[0].created_at;
      delete result[0].cafe_res_time;
      delete result[0].cafe_img;
      result[0].branches = cafeBranches;
      return result;
    });

  const cafeBrewingOption = await mysql.query("cafeBrewingOption", cafe_id);

  const cafeOpTime = await mysql.query("cafeOpTime", cafe_id);

  const cafeKeyword = await mysql.query("cafeKeyword", cafe_id);

  cafeDetail[0].brewingOption = cafeBrewingOption;
  cafeDetail[0].opTime = cafeOpTime;
  cafeDetail[0].keywords = cafeKeyword;

  res.send(cafeDetail[0]);
});

// [조회] cafe 상세페이지2 - cafe images
router.get("/image/:cafe_id", async (req, res) => {
  const { cafe_id } = req.params;
  const cafeImage = await mysql.query("cafeImage", cafe_id);

  res.send(cafeImage);
});

// [조회] cafe 상세페이지3 - menu, facility
router.get("/info/:cafe_id", async (req, res) => {
  const { cafe_id } = req.params;
  const cafeInfo = {};

  const cafeMenu = await mysql.query("cafeMenu", cafe_id);
  const cafeFacility = await mysql.query("cafeFacility", cafe_id);

  cafeInfo.cafeMenu = cafeMenu;
  cafeInfo.cafeFacility = cafeFacility;

  res.send(cafeInfo);
});

// [생성] cafe 추가 api (test)
// router.post("/", async (req, res) => {
//   const result = await mysql.query("cafeCreate", req.body.param);
//   res.send(result);
// });

// [생성] cafe 추가 api
router.post("/", async (req, res) => {
  const conn = await mysql.getConnection();
  await conn.beginTransaction();

  conn.query(sql["cafeCreate"], req.body.cafe, async (err, rows, fields) => {
    if (err) {
      console.log(err);
      await conn.rollback();
      res.status(500).send({ err: err });
    } else {
      const cafe_id = rows.insertId;
      console.log(rows);
      const items1 = [];
      const items2 = [];

      for (const item of req.body.images) {
        items1.push([
          cafe_id,
          item.type,
          item.cafe_image_url,
          item.thumbnail_url,
        ]);
      }

      for (const item of req.body.menus) {
        items2.push([
          cafe_id,
          item.menu_name,
          item.menu_price_hot,
          item.menu_price_ice,
          item.menu_type,
          item.menu_aromanote,
          item.is_signature,
        ]);
      }

      // query에서 배열을 전달할 때는 또 배열로 감싸야..!!! 매우 중요 [items]
      conn.query(
        sql["cafeImageInsert"],
        [items1],
        async (err2, rows2, fields2) => {
          if (err2) {
            console.log(err2);
            await conn.rollback();
            res.status(500).send({ err: err2 });
          } else {
            conn.query(
              sql["cafeMenuInsert"],
              [items2],
              async (err3, rows2, fields2) => {
                if (err3) {
                  console.log(err3);
                  await conn.rollback();
                  res.status(500).send({ err: err3 });
                } else {
                  await conn.commit();
                  res.status(200).send(rows);
                }
              }
            );
          }

          await conn.release();
        }
      );
    }
  });
});

module.exports = router;
