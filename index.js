const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;
require("dotenv").config();

// middleware log
const logMiddleware = (req, res, next) => {
  console.log(req.method, req.url, new Date().toString());
  next();
};
// buat mengijinkan fronetnd akses backend
app.use(cors());
// buat mengaktifkan req.body
// app.use : pemasangan middleware global
app.use(express.json());
// buat upload foto dan reserve file
app.use(express.urlencoded({ extended: false }));
app.use(logMiddleware);

app.get("/", (req, res) => {
  res.status(200).send({ message: "ini API MATOA 1.0" });
});

const { productsRoutes } = require("./src/routes");

app.use("/product", productsRoutes);

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
