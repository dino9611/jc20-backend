const { dbCon } = require("./../connections");
// cara pake class
// class productsControllers {
//   static async getProduct(req, res) {
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
//   }
// }
let productsControllers = {};

productsControllers.getProduct = async (req, res) => {
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
    let [result] = await conn.query(sql);
    // console.log("query isi:", ); // req.query adalah object
    // object bisa di destructuring
    console.log(result, "isi result");
    return res.status(200).send(result);
  } catch (error) {
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
