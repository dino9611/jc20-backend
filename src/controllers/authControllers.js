const { createJwtAccess, createJwtemail } = require("../lib/jwt");
const { registerService, loginService } = require("../services/authService");
const { dbCon } = require("./../connections");
const transporter = require("./../lib/transporter");
const handlebars = require("handlebars");
const myCache = require("./../lib/cache");
const path = require("path");
const fs = require("fs");

module.exports = {
  // register
  register: async (req, res) => {
    try {
      const {
        success,
        data: userData,
        message,
      } = await registerService(req.body);
      //  create something/value unique
      let timecreated = new Date().now();

      const dataToken = {
        id: userData.id,
        username: userData.username,
        timecreated,
      };
      // use node cache
      let berhasil = myCache.set(userData.id, dataToken, 5 * 60);
      if (!berhasil) {
        throw { message: "error caching" };
      }

      //   buat token email verified dan token untuk aksees
      const tokenAccess = createJwtAccess(dataToken);
      const tokenEmail = createJwtemail(dataToken);
      const host =
        process.env.NODE_ENV === "production"
          ? "http://namadomainfe"
          : "http://localhost:3000";
      const link = `${host}/verified/${tokenEmail}`;
      //   kirim email
      let filepath = path.resolve(__dirname, "../template/emailTemplate.html");
      // ubah html jadi string pake fs.readfile
      let htmlString = fs.readFileSync(filepath, "utf-8");
      console.log(htmlString);
      const template = handlebars.compile(htmlString);
      const htmlToEmail = template({
        username: userData.username,
        link,
      });
      console.log(htmlToEmail);
      // transporter sendmail sebenarnya async
      transporter.sendMail({
        from: "Hokage <dinotestes12@gmail.com>",
        to: userData.email,
        // to: `dinopwdk@gmail.com`,
        subject: "tolong verifikasi tugas grade A ujian chunin",
        html: htmlToEmail,
      });
      //   kriim data user dna token akses lagi untuk login
      res.set("x-token-access", tokenAccess);
      return res.status(200).send(userData);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message || error });
    }
  },
  // login
  // TODO:
  // 1. login boleh pake username atau email
  // 2. encript dulu passwordnya
  // 3. get data user dengan username atau email dan password
  // 4. kalo user ada maka kriim token access, sama data user
  // 5. get data cartnya juga
  login: async (req, res) => {
    try {
      const { success, data: userData, message } = await loginService(req.body);

      const dataToken = {
        id: userData.id,
        username: userData.username,
      };
      //   buat token email verified dan token untuk aksees
      const tokenAccess = createJwtAccess(dataToken);
      res.set("x-token-access", tokenAccess);
      return res.status(200).send(userData);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message || error });
    }
  },
  keeplogin: async (req, res) => {
    const { id } = req.user;
    let conn, sql;
    try {
      conn = await dbCon.promise();
      sql = `select id,username,isVerified,email from users where id = ?`;
      let [result] = await conn.query(sql, [id]);
      return res.status(200).send(result[0]);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message || error });
    }
  },
  accountVerified: async (req, res) => {
    const { id } = req.user;
    let conn, sql;
    try {
      conn = await dbCon.promise().getConnection();
      // sql trnasaction initialisasi atau checkpoint feature sql transaction
      // biasanya sql transaction ini digunakan pada saat manipulasi data
      await conn.beginTransaction();
      // ngecek user sudah verified atau belum
      sql = `select id from users where id = ? and isVerified = 1`;
      let [userVerified] = await conn.query(sql, [id]);
      console.log(req.user);
      if (userVerified.length) {
        // user sudah verified
        throw { message: "udah verified woy nggak usah diklik lagi " };
      }
      sql = `update users set ? where id = ?`;
      let updateData = {
        isVerified: 1,
      };
      await conn.query(sql, [updateData, id]);
      sql = `select id,username,isVerified,email from users where id = ?`;
      let [result] = await conn.query(sql, [id]);
      await conn.commit();
      conn.release();
      return res.status(200).send(result[0]);
    } catch (error) {
      conn.rollback();
      conn.release();
      console.log(error);
      return res.status(500).send({ message: error.message || error });
    }
  },
  sendEmailVerified: async (req, res) => {
    const { id, email, username } = req.body;
    try {
      //  create something/value unique
      let timecreated = new Date().getTime();
      const dataToken = {
        id: id,
        username: username,
        timecreated,
      };
      // use node cache
      let berhasil = myCache.set(id, dataToken, 5 * 60);
      if (!berhasil) {
        throw { message: "error caching" };
      }

      const tokenEmail = createJwtemail(dataToken);
      //?kirim email verifikasi
      const host =
        process.env.NODE_ENV === "production"
          ? "http://namadomainfe"
          : "http://localhost:3000";
      const link = `${host}/verified/${tokenEmail}`;
      // cari path email template
      let filepath = path.resolve(__dirname, "../template/emailTemplate.html");
      // ubah html jadi string pake fs.readfile
      let htmlString = fs.readFileSync(filepath, "utf-8");
      console.log(htmlString);
      const template = handlebars.compile(htmlString);
      const htmlToEmail = template({
        username: username,
        link,
      });
      console.log(htmlToEmail);
      await transporter.sendMail({
        from: "Hokage <dinotestes12@gmail.com>",
        to: email,
        // to: `dinopwdk@gmail.com`,
        subject: "tolong verifikasi tugas grade A ujian chunin",
        html: htmlToEmail,
      });
      return res.status(200).send({ message: "berhasil kirim email lagi99x" });
    } catch (error) {
      console.log(error);
      return res.status(200).send({ message: error.message || error });
    }
  },
};
