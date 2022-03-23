const express = require("express");
const app = express();
const cors = require("cors");
const port = 5000;
const mysql = require("mysql2");

const dbCon = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "password",
  database: "latihandb",
  port: 3306,
});

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

// let products = [
//   { id: 1, name: "popok hokage", price: 50000 },
//   {
//     id: 2,
//     name: "pasir kazekage",
//     price: 20000,
//   },
//   {
//     id: 3,
//     name: "Gurita adeknya raikage",
//     price: 100000,
//   },
// ];

app.get("/", (req, res) => {
  res.status(200).send({ message: "ini hellow" });
});
// req.query .. semua punya || query adalah value setelah tanda tanya
// di url
// req.params :semua punya
// req.body //tidak dimiliki get

app.get("/product", async (req, res) => {
  const { maxPrice, minPrice } = req.query;
  let conn = dbCon.promise();
  // get all products
  // inget hasil select selalu array
  let sql = `select * from products where true `;
  // maxprice
  if (maxPrice) {
    sql += `and price <= ${dbCon.escape(maxPrice)} `;
  }
  if (minPrice) {
    sql += `and price >= ${dbCon.escape(minPrice)} `;
  }

  console.log(sql);
  try {
    let [result] = await conn.execute(sql);
    // console.log("query isi:", ); // req.query adalah object
    // object bisa di destructuring
    console.log(result, "isi result");
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message || error });
  }
});

app.get("/product/category", (req, res) => {
  // console.log(productSelected);
  return res.send({ message: "tidak ada lol" });
});

app.get("/product/:id", async (req, res) => {
  let { id } = req.params;
  let conn = dbCon.promise();
  // select * from products where id = ?
  try {
    let sql = `select * from products where id = ?`;
    let [productSelected] = await conn.query(sql, [id]);
    console.log(productSelected);
    return res.send({
      ...productSelected[0],
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message || error });
  }
});

app.delete("/product/:id", async (req, res) => {
  let { id } = req.params;
  let conn = dbCon.promise();
  // select * from products where id = ?
  try {
    // get data dulu
    let sql = `select * from products where id = ?`;
    let [result] = await conn.query(sql, [id]);
    if (!result.length) {
      throw { message: "id tidak ditemukan" };
    }
    //lalu delete
    sql = `delete from products where id = ?`;
    await conn.query(sql, [id]);
    // optional boleh di get all products ulang
    sql = `select * from products`;
    let [products] = await conn.query(sql);
    console.log(products);
    return res.send(products);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message || error });
  }
});

app.post("/product", async (req, res) => {
  // tanpa promise
  // kalo insert parameter keduanya harus object
  // dbCon.query(`INSERT into products set ?`, req.body, (err, result, fields) => {
  //   if (err) {
  //     console.log(err);
  //     return res.status(500).send({ message: err.message });
  //   }
  //   console.log("jika lewati sini sql yang diatas aman");
  //   console.log("ini result", result);

  //   // jika errnya dilewati pasti berhasil
  //   let sql = `select * from products`;
  //   // execute untuk select saja karena perforamncenya lebih baik untuk select
  //   dbCon.execute(sql, (err, products, fields) => {
  //     if (err) {
  //       console.log(err);
  //       return res.status(500).send({ message: err.message });
  //     }
  //     console.log("ini fields", fields);
  //     console.log("ini products", products);
  //     return res.status(200).send(products);
  //   });
  // });
  // cara promise

  let conn = dbCon.promise();
  try {
    // insert
    let sql = `INSERT into products set ?`;
    let [result] = await conn.query(sql, req.body);
    // response dari insert ada insertId
    console.log("isi result insert", result);
    sql = `select * from products`;
    // select data perlu tempat penampungan data
    let [products] = await conn.query(sql);
    console.log("ini products", products);
    return res.status(200).send(products);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message || error });
  }
});

app.put("/product/:id", async (req, res) => {
  const { id } = req.params;
  let conn = dbCon.promise();
  // klo mau tambah property untuk di update
  // let updateData = {...req.body,namacolumn:'tambahaja'}
  try {
    // get datanya nya dahulu
    let sql = `select * from products where id = ?`;
    let [result] = await conn.query(sql, [id]);
    if (!result.length) {
      throw { message: "id tidak ditemukan" };
    }
    // update data
    sql = `Update products set ? where id = ?`;
    // tanda tanya untuk set harus object
    await conn.query(sql, [req.body, id]);
    // optional boleh di get all products ulang
    sql = `select * from products`;
    let [products] = await conn.query(sql);
    console.log(products);
    return res.send(products);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message || error });
  }
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
