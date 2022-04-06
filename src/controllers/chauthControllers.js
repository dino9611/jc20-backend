const { dbCon } = require("./../connections");
const { createJwtAccess, createJwtemail } = require("../lib/jwt");
const myCache = require("./../lib/cache");
const crypto = require("crypto");

const hashPass = (password) => {
  // puripuriprisoner adalah kunci untuk hashing
  let hashing = crypto
    .createHmac("sha256", "puripuriprisoner")
    .update(password)
    .digest("hex");
  return hashing;
};

module.exports = {
  register: async (req, res) => {
    const { username, email, password } = req.body;

    // init variable
    let conn, sql;
    try {
      conn = await dbCon.promise().getConnection();
      // cari apakah ada username yang sama
      sql = `select id from users where username = ?`;
      let [result] = await conn.query(sql, [username]);

      if (result.length) {
        // username telah terdaftar
        throw { message: "username telah di pakai" };
      }

      let insertData = {
        username,
        email,
        password: hashPass(password),
        roles_id: 2,
        isVerified: 0,
      };
      // insert data to table users
      sql = `insert into users set ?`;
      let [result1] = await conn.query(sql, insertData);
      // get data from table users
      sql = `select * from users where id = ? and isActivate = 1`;
      let [userData] = await conn.query(sql, [result1.insertId]);
      //   buat datatoken
      let datatoken = {
        id: userData[0].id,
        username: userData[0].username,
        roles_id: userData[0].roles_id,
      };
      //   release connection
      conn.release();
      let token = createJwtAccess(datatoken);
      res.set("x-token-access", token);
      return res.status(200).send(userData[0]);
    } catch (error) {
      //   release connection
      conn.release();
      console.log(error);
      return res.status(500).send({ message: error.message || error });
    }
  },
  login: async (req, res) => {
    const { username, password } = req.body;

    // init variable
    let conn, sql;
    try {
      conn = await dbCon.promise().getConnection();
      // cari apakah ada username yang sama
      sql = `select * from users where username = ? and password = ? and isActivate = 1`;
      let [userData] = await conn.query(sql, [username, hashPass(password)]);
      console.log(userData);
      if (!userData.length) {
        // username telah terdaftar
        throw { message: "username atau password salah" };
      }
      //   buat datatoken
      let datatoken = {
        id: userData[0].id,
        username: userData[0].username,
        roles_id: userData[0].roles_id,
      };
      //   release connection
      conn.release();
      let token = createJwtAccess(datatoken);
      res.set("x-token-access", token);
      return res.status(200).send(userData[0]);
    } catch (error) {
      //   release connection
      conn.release();
      console.log(error);
      return res.status(500).send({ message: error.message || error });
    }
  },
  deactiveUser: async (req, res) => {
    const { userId } = req.body;
    let conn, sql;
    try {
      conn = await dbCon.promise().getConnection();
      // user dengan user id tertentu ada atau tidak
      sql = `select id from users where id = ?`;
      let [result] = await conn.query(sql, [userId]);
      if (!result.length) {
        throw { message: "user tidak ditemukan" };
      }
      sql = `update users set ? where id = ? `;
      let updateData = {
        isActivate: 0,
      };

      await conn.query(sql, [updateData, userId]);

      conn.release();
      return res.status(200).send({ message: "berhasil update data" });
    } catch (error) {
      conn.release();
      console.log(error);
      return res.status(500).send({ message: error.message || error });
    }
  },
};
