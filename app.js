const express = require("express");
const app = express();

app.use(
  express.json({
    limit: "50mb",
  })
);

app.listen(3000, () => {
  console.log("3000번 포트에서 서버가 시작되었습니다.");
});
