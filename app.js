const express = require("express");
const app = express();
require("dotenv").config({ path: "mysql/.env" });
const mysql = require("./mysql");

app.use(
  express.json({
    limit: "50mb",
  })
);

app.get("/api/cafe", async (req, res) => {
  const cafeList = await mysql.query("cafeList");
  res.send(cafeList);
});

app.listen(3000, () => {
  console.log("3000번 포트에서 서버가 시작되었습니다.");
});
