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
// [검색] 일반 카페 목록 api
router.get("/", async (req, res) => {
  const cafeListOnly = await mysql.query("cafeListOnly");
  res.send(cafeListOnly);
});

// [조회] 유저 아이디로 마이카페리스트 조회 api
router.get("/cnotemylist/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const mylist = await mysql.query("mylist", user_id);
  res.json(mylist);
});

// [조회] 위에서 받아온 마이카페리스트 pk(mylist_id)이용, 카페 이름 부르기 api
router.get("/mylistcafename/:mylist_id", async (req, res) => {
  const { mylist_id } = req.params;
  const myListCafeName = await mysql.query("myListCafeName", mylist_id);
  res.json(myListCafeName);
});

// [생성] cnote 테이블에 일반정보 저장 api

// transaction 참고
router.post("/", async (req, res) => {
  const conn = await mysql.getConnection();
  await conn.beginTransaction();

  conn.query(sql["cnoteCreate"], req.body.cnote, async (err, rows, fields) => {
    if (err) {
      console.log(err);
      await conn.rollback();
      res.status(500).send({ err: err });
    } else {
      const cnote_id = rows.insertId;
      console.log(rows);
      const items1 = [];
      const items2 = [];

      for (const item of req.body.cafeids) {
        items1.push([cnote_id, item.cafe_id, item.cnote_cafe_content]);
      }
      for (const item of req.body.images) {
        items2.push([cnote_id, item.images_cnote_url]);
      }

      // query에서 배열을 전달할 때는 또 배열로 감싸야..!!! 매우 중요 [items]
      conn.query(
        sql["cnoteCafeInsert"],
        [items1],
        async (err2, rows2, fields2) => {
          if (err2) {
            console.log(err2);
            await conn.rollback();
            res.status(500).send({ err: err2 });
          } else {
            conn.query(
              sql["cnoteImageInsert"],
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
