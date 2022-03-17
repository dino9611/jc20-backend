// cara import di commonJs atau dibawah es6
// import http from 'http'
const http = require("http");
// const fs = require("fs");
// const fs = require("fs/promises");
const {
  appendFile,
  writeFile: writeFileprom,
  readFile,
} = require("fs/promises");

const {
  writeFile,
  readFileSync,
  writeFileSync,
  appendFileSync,
  existsSync,
  mkdirSync,
} = require("fs");

// cara mengubah callback menjadi promise
const writeFilePromise = (path, isifile) => {
  return new Promise((resolve, rejects) => {
    writeFile(path, isifile, (err) => {
      if (err) {
        // kalo reject kebaca maka kodingan akna masuk catch
        rejects(err);
      }
      // klo resolve terbaca maka object akan masuk kedalam res
      resolve({ message: "berhasil" });
    });
  });
};

const path = require("path");
const PORT = 4000;

let database = [
  {
    id: 1,
    username: "dino",
    password: "strong9",
  },
];

const { bebas, kirimEmail } = require("./helper");
// console.log(sesuatu.bebas);

let angka = 1;
const server = http.createServer(async (req, res) => {
  // console.log(req); // coba lihat yaa diterminal
  // console.log(req.url)
  if (req.url === "/" && req.method === "GET") {
    console.log(angka);
    angka++;
    res.writeHead(200, { "Content-type": "text/html" });
    kirimEmail("aqil@gmail.com");
    // console.log(__dirname);
    // dirname adaalah alamat folder file ini
    // path resolve
    // console.log(path.resolve(__dirname, "./index.html"));
    let index = await readFile(
      path.resolve(__dirname, "./index.html"),
      "utf-8"
    );
    // console.log(index);
    res.end(index);
  } else if (req.url === "/user" && req.method === "GET") {
    res.writeHead(200, { "Content-type": "application/json" });
    res.end(JSON.stringify(database));
  } else if (req.url === "/file" && req.method === "POST") {
    // ambil data dari req.body
    let data = ``;
    // trigger saat data masih loading
    req.on("data", (chunk) => {
      data += chunk;
    });
    // data setelah loading
    req.on("end", async () => {
      let newdata = JSON.parse(data);
      if (!existsSync("./files")) {
        mkdirSync("./files");
      }
      try {
        let result = await writeFilePromise(
          `./files/lat${new Date().getTime()}.txt`,
          newdata.kata
        );
        console.log("ini res", result);
        // berhasil buat file

        res.writeHead(200, { "Content-type": "application/json" });
        // serialisasi denan mengubah javascript jadi json
        return res.end(JSON.stringify(result));
      } catch (err) {
        console.error(err, "TES LINE 94");
        res.writeHead(500, { "Content-type": "application/json" });
        return res.end(JSON.stringify({ message: err }));
      }
      // writeFile(
      //   `./files/lat${new Date().getTime()}.txt`,
      //   newdata.kata,
      //   (err) => {
      //     if (err) {
      //       console.log(err, "TES LINE 50");
      //       res.writeHead(500, { "Content-type": "application/json" });
      //       return res.end({ message: err });
      //     }
      //     res.writeHead(200, { "Content-type": "application/json" });
      //     return res.end(JSON.stringify({ message: "berhasil" }));
      //   }
      // );
    });
  } else {
    res.writeHead(404, { "Content-type": "text/html" });
    res.end("<h1>NotFound</h1>");
  }
});

server.listen(PORT, () => console.log("server jalan di port " + PORT));
