const express = require("express");
const router = express.Router();
const mysql = require("../mysql");

// [조회] 사용자리스트 조회 api
router.get("/", async (req, res) => {
  const userList = await mysql.query("userList");
  if (userList) {
    res.status(200).json(userList);
  } else {
    res
      .status(404)
      .json({ message: `서버는 연결되었는데 뭔가가 잘 못 되었다.` });
  }
});

// [생성] 사용자리스트 생성 api
router.post("/", async (req, res) => {
  const result = await mysql.query("userCreate", req.body.param);
  res.send(result);
});

module.exports = router;
