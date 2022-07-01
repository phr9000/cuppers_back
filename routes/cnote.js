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
router.post("/", async (req, res) => {
  const cnoteCreate = await mysql.query("cnoteCreate", req.body.param);
  res.send(cnoteCreate);
});
// [생성] cnote id 생성 동시에 cnote_cafe에 생성된 cnote_id, 받아온 카페 id 저장 api
// TODO: 6/18 실제로 되는지는 프론트에서 params 라우터에 넘겨서 확인해야 됨!
router.post("/", async (req, res) => {
  const cnoteCafeCreate = await mysql.query("cnoteCafeCreate", req.body.param);
  res.send(cnoteCafeCreate);
});

// transaction 참고
// router.post("/", async (req, res) => {
//   const conn = await mysql.getConnection();
//   await conn.beginTransaction();

//   conn.query(sql["cafeCreate"], req.body.cafe, async (err, rows, fields) => {
//     if (err) {
//       console.log(err);
//       await conn.rollback();
//       res.status(500).send({ err: err });
//     } else {
//       const cafe_id = rows.insertId;
//       console.log(rows);
//       const items = [];

//       for (const item of req.body.images) {
//         items.push([
//           cafe_id,
//           item.type,
//           item.cafe_image_url,
//           item.thumbnail_url,
//         ]);
//       }

//       // query에서 배열을 전달할 때는 또 배열로 감싸야..!!! 매우 중요 [items]
//       conn.query(
//         sql["cafeImageInsert"],
//         [items],
//         async (err2, rows2, fields2) => {
//           if (err2) {
//             console.log(err2);
//             await conn.rollback();
//             res.status(500).send({ err: err2 });
//           } else {
//             await conn.commit();
//             res.status(200).send(rows);
//           }

//           await conn.release();
//         }
//       );
//     }
//   });
// });

module.exports = router;
