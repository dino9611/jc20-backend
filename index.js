const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;
require("dotenv").config();

const db = require("./src/models");
const { products, variaties } = db;

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

app.get("/seq/sync", (req, res) => {
  db.sequelize.sync().then(() => {
    console.log("syncronized");
    res.status(200).send({ message: "henshin db" });
  });
});

app.post("/seq/product", async (req, res) => {
  // add data sequelize
  try {
    const instance = await products.create(req.body);
    console.log(instance);
    return res.status(200).send({ message: "berhasil add data" });
  } catch (error) {
    return res.status(500).send({ message: error.message || error });
  }
});

app.get("/seq/product", async (req, res) => {
  try {
    // select * from products
    let offset = 0;
    let limit = 10;

    // const result = await product.findAll({ limit: limit, offset: offset });
    const result = await products.findAll({
      limit: limit,
      offset: offset,
      // attribut untuk memilih colum yang dimau
      attributes: ["name", "price", "id"],
    });

    console.log(result);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ message: error.message || error });
  }
});

app.get("/seq/product/:id", async (req, res) => {
  try {
    const { id } = req.params;
    // select * from products

    // const result = await product.findAll({ limit: limit, offset: offset });
    const result = await products.findAll({
      // where: { id: id },
      // order: [db.sequelize.col("variaties"), "DESC"],
      include: [
        {
          model: variaties,
          separate: true,
          required: true,
          order: [["id", "DESC"]],
        },
      ],
    });

    console.log(result);
    return res.status(200).send(result);
  } catch (error) {
    return res.status(500).send({ message: error.message || error });
  }
});

app.post("/seq/variaties", async (req, res) => {
  try {
    // ubah object jadi json
    req.body.images = JSON.stringify(req.body.images);
    await variaties.create(req.body);
    return res.status(200).send({ message: "berhasil add data" });
  } catch (error) {
    return res.status(500).send({ message: error.message || error });
  }
});

app.delete("/seq/product", async (req, res) => {});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
