const express = require("express");
const app = express();
require("dotenv").config({ path: "mysql/.env" });
const mysql = require("./mysql");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

app.use("/static/images", express.static("public/images"));

app.use(
  express.json({
    limit: "50mb",
  })
);

const corsOptions = {
  origin: "http://localhost:9000", // 허용할 도메인 설정
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));

const imageStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/images"); //전송된 파일 저장되는 곳
  },
  filename: function (req, file, cb) {
    cb(null, new Date().valueOf() + path.extname(file.originalname));
  },
});

const imageUpload = multer({ storage: imageStorage });

app.post("/api/upload/image", imageUpload.single("image"), async (req, res) => {
  const fileInfo = {
    product_id: parseInt(req.body.product_id),
    originalname: req.file.originalname,
    mimetype: req.file.mimetype,
    filename: req.file.filename,
    path: req.file.path,
  };

  res.send(fileInfo);
});

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
