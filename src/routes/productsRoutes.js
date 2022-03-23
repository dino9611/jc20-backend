const express = require("express");

const { dbCon } = require("./../connections");
const router = express.Router();
const { productsControllers } = require("./../controllers");

const { getProduct } = productsControllers;
router.get("/", getProduct);

router.get("/:id", async (req, res) => {
  let { id } = req.params;
  let conn = await dbCon.promise().getConnection();
  // select * from products where id = ?
  try {
    let sql = `select * from products where id = ?`;
    let [productSelected] = await conn.query(sql, [id]);
    console.log(productSelected);
    // conn.release();
    res.send({
      ...productSelected[0],
    });
  } catch (error) {
    // conn.release();
    console.log(error);
    return res.status(500).send({ message: error.message || error });
  } finally {
    // conn.release();
  }
});

router.delete("/:id", async (req, res) => {
  let { id } = req.params;
  // select * from products where id = ?
  let conn;
  try {
    // jika pake connecytion jangan lupa di release
    conn = await dbCon.promise().getConnection();
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
    conn.release();
    return res.send(products);
  } catch (error) {
    conn.release();
    console.log(error);
    return res.status(500).send({ message: error.message || error });
  }
});

router.post("/", async (req, res) => {
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

router.put("/:id", async (req, res) => {
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

module.exports = router;
