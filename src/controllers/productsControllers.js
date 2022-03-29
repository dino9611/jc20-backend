const { dbCon } = require("./../connections");
const fs = require("fs");
let productsControllers = {};

productsControllers.getProduct = async (req, res) => {
  const { maxPrice, minPrice } = req.query;
  let page = 0;
  let limit = 10;

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
  sql += ` limit ${page},${limit}`;

  console.log(sql);
  try {
    let [result] = await conn.query(sql);
    let [totaldata] = await conn.query(
      `select count(*) as count from products`
    );
    res.set("x-total-count", totaldata[0].count);
    // console.log("query isi:", ); // req.query adalah object
    // object bisa di destructuring
    console.log(result, "isi result");
    return res.status(200).send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message || error });
  }
};

productsControllers.getProductDetail = async (req, res) => {
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
};

productsControllers.deleteProduct = async (req, res) => {
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
};

productsControllers.addproduct = async (req, res) => {
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
};

productsControllers.editProduct = async (req, res) => {
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
};

productsControllers.addProductUpload = async (req, res) => {
  console.log("ini req.files", req.files);
  console.log("ini req.body", req.body); // data selain file
  // jika codingan diatas terbaca maka file sudah masuk ke backend
  // dan selanjutnya path dari image dan data masukkan ke dalam database
  let conn = dbCon.promise();
  let path = "/products";
  // simpan ke database '/products/PROD1648525218611.jpeg'
  const data = JSON.parse(req.body.data); // {name:'bla',"price":34324}
  const { products } = req.files;
  const imagePath = products ? `${path}/${products[0].filename}` : null;
  data.image = imagePath;
  try {
    // {name:'bla',"price":34324,image:/products/blbabla}
    // insert to database
    console.log(data);
    await conn.query(`insert into products set ?`, data);
    res.status(200).send({ message: "berhasil upload" });
  } catch (error) {
    if (imagePath) {
      // klo foto sudah terupload dan sql ggaal maka fotonya dihapus
      fs.unlinkSync("./public" + imagePath);
    }
    console.log(error);
    return res.status(500).send({ message: error.message || error });
  }
};

module.exports = productsControllers;
// module.exports = {
//   getProduct: async (req, res) => {
//     const { maxPrice, minPrice } = req.query;
//     let conn = dbCon.promise();
//     // get all products
//     // inget hasil select selalu array
//     let sql = `select * from products where true `;
//     // maxprice
//     if (maxPrice) {
//       sql += `and price <= ${dbCon.escape(maxPrice)} `;
//     }
//     if (minPrice) {
//       sql += `and price >= ${dbCon.escape(minPrice)} `;
//     }

//     console.log(sql);
//     try {
//       let [result] = await conn.query(sql);
//       // console.log("query isi:", ); // req.query adalah object
//       // object bisa di destructuring
//       console.log(result, "isi result");
//       return res.status(200).send(result);
//     } catch (error) {
//       console.log(error);
//       return res.status(500).send({ message: error.message || error });
//     }
//   },
// };
