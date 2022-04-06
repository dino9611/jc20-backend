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
};
