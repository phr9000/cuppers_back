const express = require("express");
const app = express();

app.use(express.json());

app.post("/", function (req, res) {
  console.log(req.body); // 사용자의 JSON 요청
  res.send(req.body); // JSON 응답
});

require("dotenv").config({ path: "mysql/.env" });
const mysql = require("./mysql");

app.use(
  express.json({
    limit: "50mb",
  })
);

// app.get("/api/cafe", async (req, res) => {
//   const cafeList = await mysql.query("cafeList");
//   res.send(cafeList);
// });

const cafeRoutes = require("./routes/cafe");
app.use("/api/cafe", cafeRoutes);

const userRoutes = require("./routes/user");
app.use("/api/user", userRoutes);

const reviewRoutes = require("./routes/review");
app.use("/api/review", reviewRoutes);

const keywordRoutes = require("./routes/keyword");
app.use("/api/keyword", keywordRoutes);

const cnoteRoutes = require("./routes/cnote");
app.use("/api/cnote", cnoteRoutes);

app.listen(3000, () => {
  console.log("3000번 포트에서 서버가 시작되었습니다.");
});
