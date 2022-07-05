const express = require("express");
const router = express.Router();
const mysql = require("../mysql");
const sql = require("../mysql/sql");

// [조회] cafe 리스트
router.get("/", async (req, res) => {
  const user_id = req.query.user;
  const searchParam = "%" + req.query.search + "%";
  let minLat = 0;
  let maxLat = 0;
  let minLong = 0;
  let maxLong = 0;
  // 지도의 한계좌표가 빈값으로 왔을 때 한반도 전체를 범위로 지정
  if (
    !req.query.lat_min ||
    !req.query.lat_max ||
    !req.query.long_min ||
    !req.query.long_max
    // || req.query.lat_min +
    //   req.query.lat_max +
    //   req.query.long_min +
    //   req.query.long_max ===
    //   ""
  ) {
    minLat = 30;
    maxLat = 45;
    minLong = 120;
    maxLong = 135;
  } else {
    minLat = Number(req.query.lat_min);
    maxLat = Number(req.query.lat_max);
    minLong = Number(req.query.long_min);
    maxLong = Number(req.query.long_max);
  }
  const curLat = Number(req.query.current_lat);
  const curLong = Number(req.query.current_long);
  const order = req.query.order;
  const sort = req.query.sort;
  const page = Number(req.query.page);
  const limit = Number(req.query.limit);

  // 조회 조건에 맞춰 카페 테이블의 데이터 불러오는 쿼리
  const cafeList = await mysql
    .query("cafeList", [
      curLat,
      curLong,
      user_id,
      user_id,
      searchParam,
      searchParam,
      searchParam,
      minLat,
      maxLat,
      minLong,
      maxLong,
      sort,
      order,
      sort,
      order,
      sort,
      order,
      sort,
      order,
      limit * (page - 1),
      limit,
    ])
    .then(async (cafeList) => {
      if (cafeList.length === 0) {
        return cafeList;
      }

      const ids = [];
      cafeList.forEach((item) => {
        ids.push(item.cafe_id);
      });
      const cafeListOpTime = await mysql.query("cafeListOpTime", [ids]);
      const cafeListKeyword = await mysql.query("cafeListKeyword", [ids]);

      // 카페 object 내에 키워드, 영업시간 object들을 배열로 추가
      cafeList.forEach((cafe) => {
        const temp_id = cafe.cafe_id;
        cafe.keywords = cafeListKeyword.filter(
          (obj) => obj.cafe_id === temp_id
        );
        cafe.opTime = cafeListOpTime.filter((obj) => obj.cafe_id === temp_id);
      });

      return cafeList;
    });

  // pagination 작업 위한 총개수 가져오기
  const cafeCnt = await mysql.query("cafeCnt", [
    searchParam,
    searchParam,
    searchParam,
    minLat,
    maxLat,
    minLong,
    maxLong,
  ]);

  result = {};
  result.totalCnt = cafeCnt[0].totalCnt;
  result.arr = cafeList;

  res.send(result);
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

// [조회] My list 가져오기
router.get("/mylist/all/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const myLists = await mysql.query("myListAll", user_id);

  res.send(myLists);
});

// [조회] 특정 My list의 cafes 가져오기
router.get("/mylist/one/:mylist_id", async (req, res) => {
  const { mylist_id } = req.params;
  const myList = await mysql.query("myListOne", mylist_id);

  res.send(myList);
});

router.get("/info/:cafe_id", async (req, res) => {
  const { cafe_id } = req.params;
  const cafeInfo = {};

  const cafeMenu = await mysql.query("cafeMenu", cafe_id);
  const cafeFacility = await mysql.query("cafeFacility", cafe_id);

  cafeInfo.cafeMenu = cafeMenu;
  cafeInfo.cafeFacility = cafeFacility;

  res.send(cafeInfo);
});

module.exports = router;
