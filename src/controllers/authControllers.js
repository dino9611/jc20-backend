const { createJwtAccess, createJwtemail } = require("../lib/jwt");
const { registerService, loginService } = require("../services/authService");
const { dbCon } = require("./../connections");

module.exports = {
  // register
  register: async (req, res) => {
    try {
      const {
        success,
        data: userData,
        message,
      } = await registerService(req.body);
      if (!success) {
        throw { message: message };
      }

      const dataToken = {
        id: userData.id,
        username: userData.username,
      };

      //   buat token email verified dan token untuk aksees
      const tokenAccess = createJwtAccess(dataToken);
      const tokenEmail = createJwtemail(dataToken);
      //   kirim email

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

      if (!success) {
        console.log(success);
        throw { message: message };
      }

      const dataToken = {
        id: userData.id,
        username: userData.username,
      };
      //   buat token email verified dan token untuk aksees
      const tokenAccess = createJwtAccess(dataToken);
      res.set("x-token-access", tokenAccess);
      return res.status(200).send(userData);
    } catch (error) {
      conn.release();
      console.log(error);
      return res.status(500).send({ message: error.message || error });
    }
  },
  keeplogin: async (req, res) => {
    const { id } = req.params;
    let conn, sql;
    try {
      conn = await dbCon.promise();
      sql = `select * from users where id = ?`;
      let [result] = await conn.query(sql, [id]);
      return res.status(200).send(result[0]);
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message || error });
    }
  },
};
