require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;
const morgan = require("morgan");
morgan.token("date", function (req, res) {
  return new Date().toString();
});
app.use(
  morgan(":method :url :status :res[content-length] - :response-time ms :date")
);

// buat mengijinkan fronetnd akses backend
app.use(
  cors({
    // buka header untuk request
    exposedHeaders: ["x-total-count", "x-token-access"],
  })
);
// /verified/token
// buat mengaktifkan req.body method post,put,patch
// untuk ngirim data
// app.use : pemasangan middleware global
app.use(express.json());
// buat upload foto dan reserve file
app.use(express.urlencoded({ extended: false }));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.status(200).send({ message: "ini API backend challenges" });
});

const { chauthRoutes } = require("./src/routes");

app.use("/auth", chauthRoutes);

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
