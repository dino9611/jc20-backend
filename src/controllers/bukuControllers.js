const { dbCon } = require("./../connections");
const fs = require("fs");

module.exports = {
  addBuku: async (req, res) => {
    console.log("ini req.files", req.files);
    let path = "/books";
    // simpan ke database '/books/book1648525218611.jpeg'
    const data = JSON.parse(req.body.data); // {name:'bla',"price":34324}
    const { books } = req.files;
    const imagePath = books ? `${path}/${books[0].filename}` : null;
    if (!imagePath) {
      return res.status(500).send({ message: "foto tidak ada" });
    }
    let conn, sql;
    try {
      conn = dbCon.promise();
      sql = `insert into buku set ?`;
      let insertData = {
        name: data.name,
        image: imagePath,
      };
      await conn.query(sql, insertData);
      return res.status(200).send({ message: "berhasil upload buku" });
    } catch (error) {
      console.log(error);
      return res.status(500).send({ message: error.message || error });
    }
  },
  addpinjaman: async (req, res) => {
    const { userId, buku } = req.body;
    let conn, sql;
    try {
      conn = await dbCon.promise().getConnection();
      // input ke table pinjaman
      await conn.beginTransaction();
      sql = `insert into pinjaman set ?`;
      let insertData = {
        status: "minjem",
        users_id: userId,
      };
      let [pinjaman] = await conn.query(sql, insertData);
      sql = `insert into pinjaman_details set ?`;
      let today = new Date();
      for (let i = 0; i < buku.length; i++) {
        let val = buku[i];
        let exp = today.setDate(today.getDate() + val.durasi);
        let insertData1 = {
          buku_id: val.bookid,
          pinjaman_id: pinjaman.insertId,
          waktupinjam: today,
          waktuexp: new Date(exp),
        };
        await conn.query(sql, insertData1);
      }
      await conn.commit();
      conn.release();
      return res.status(200).send({ message: "berhasil" });
    } catch (error) {
      await conn.rollback();
      conn.release();
      console.log(error);
      return res.status(500).send({ message: error.message || error });
    }
  },
};
