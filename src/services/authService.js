const { dbCon } = require("../connections");

// encrypsi by crypto nodejs
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
  loginService: async (data) => {
    let { username, email, password } = data;
    let conn, sql;

    try {
      // create connection in pool
      conn = await dbCon.promise().getConnection();
      // hashing password

      password = hashPass(password);

      sql = `select id,username,isVerified,email from users where (username = ? or email = ?) and password = ?`;
      let [result] = await conn.query(sql, [username, email, password]);
      console.log(result);
      if (!result.length) {
        // user tidak ditemukan
        console.log("tes");
        throw { message: "user tidak ditemukan" };
      }
      // buat token access
      // query cart
      // lewatin dulu
      conn.release();

      return { success: true, data: result[0] };
    } catch (error) {
      conn.release();
      console.log(error);
      throw new Error(error.message || error);
      // return new Error(error.message || error);
      // return { success: false, message: error.message || error };
    }
  },
  registerService: async (data) => {
    let conn, sql;
    let { username, email, password } = data;
    try {
      // buat connection dari pool karena query lebih dari satu kali
      conn = await dbCon.promise().getConnection();
      // validasi spasi untuk username

      let spasi = new RegExp(/ /g);
      if (spasi.test(username)) {
        // klo ada spasi masuk sini
        throw { message: "ada spasinya bro" };
      }
      await conn.beginTransaction();
      sql = `select id from users where username = ? or email = ?`;

      let [result] = await conn.query(sql, [username, email]);
      if (result.length) {
        //   masuk sini berarti ada username atua emaail yang samsa
        throw { message: "username atau email telah digunakan" };
      }
      sql = `INSERT INTO users set ?`;
      //   buat object baru
      let insertData = {
        username,
        email,
        password: hashPass(password),
      };
      console.log(insertData);
      //   req.body.password = hashPass(password)
      let [result1] = await conn.query(sql, insertData);
      // get data user lagi
      console.log(result1);
      sql = `select id,username,isVerified,email from users where id = ?`;
      let [userData] = await conn.query(sql, [result1.insertId]);
      await conn.commit();
      conn.release();
      return { success: true, data: userData[0] };
    } catch (error) {
      conn.rollback();
      conn.release();
      console.log(error);
      // return Error(error.message || error);
      throw new Error(error.message || error);
      // return { success: false, message: error.message || error };
    }
  },
};
