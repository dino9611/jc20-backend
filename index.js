require("dotenv").config();
const express = require("express");
const app = express();
const http = require("http");
const server = http.createServer(app);
const { Server } = require("socket.io");
const cors = require("cors");
const port = 5000;
// const {dbCon} =require('./src/connections')
// const db = require("./src/models");

// const { products, variaties } = db;

// middleware log
const logMiddleware = (req, res, next) => {
  console.log(req.method, req.url, new Date().toString());
  next();
};

// main();

// buat mengijinkan fronetnd akses backend
app.use(
  cors({
    exposedHeaders: ["x-total-count", "x-token-access"],
  })
);
// /verified/token
// buat mengaktifkan req.body method post,put,patch
// untuk ngirim data
// app.use : pemasangan middleware global
app.use(express.json());
// buat upload foto dan reserve file
app.use(express.urlencoded({ extended: false }));
app.use(logMiddleware);
app.use(express.static("public"));

// io
const io = new Server(server, { cors: "*" });
let arrMsg = [];
let userCount = 0;

app.io = io;
app.arrMsg = arrMsg;

app.get("/", (req, res) => {
  res.status(200).send({ message: "ini API MATOA 1.0" });
});

const { productsRoutes, authRoutes } = require("./src/routes");
const { dbCon } = require("./src/connections");

app.use("/product", productsRoutes);
app.use("/auth", authRoutes);

const { auth } = require("express-oauth2-jwt-bearer");

const checkJwt = auth({
  audience: "https://api.matoa.com",
  issuerBaseURL: `https://dev-qdeojlzi.us.auth0.com/`,
});

app.get("/api/private", checkJwt, function (req, res) {
  res.json({
    message:
      "Hello from a private endpoint! You need to be authenticated to see this.",
  });
});

app.get("/mess", async (req, res) => {
  const { recepient_id, sender_id } = req.query;
  let conn, sql;
  try {
    conn = dbCon.promise();
    sql = `select * from chat where sender_id in(?,?) and recepient_id in(?,?)`;
    let [result] = await conn.query(sql, [
      sender_id,
      recepient_id,
      sender_id,
      recepient_id,
    ]);
    res.send(result);
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "error network" });
  }
});

app.get("/mess/public", (req, res) => {
  res.send(arrMsg);
});

app.post("/mess/public", (req, res) => {
  // {
  //   id:1,
  //   username:'dikamacho',
  //   content:'message'
  // }
  arrMsg.push(req.body);
  io.emit("send-message", arrMsg);
  res.status(200).send({ message: "berhasil" });
});

app.post("/sendmess", async (req, res) => {
  const { sender_id, recepient_id, public } = req.body;
  let conn, sql;
  try {
    conn = dbCon.promise();
    sql = `INSERT into chat set ?`;
    await conn.query(sql, req.body);
    sql = `select * from chat where sender_id in(?,?) and recepient_id in(?,?)`;
    let [result] = await conn.query(sql, [
      sender_id,
      recepient_id,
      sender_id,
      recepient_id,
    ]);
    io.to(recepient_id)
      .to(sender_id)
      .emit("chat-masuk", result, recepient_id, sender_id);
    res.send({ message: "berhasil kirim" });
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: "error network" });
  }
});

io.on("connection", (socket) => {
  console.log("connect", socket.handshake.auth);
  // private message settingup
  const { id } = socket.handshake.auth;
  socket.join(id);

  userCount++;
  io.emit("userCount", userCount);
  // list user yang online
  // let users = [];
  // for (let [id, socket] of io.of("/").sockets) {
  //   users.push({
  //     userID: socket.handshake.auth.id,
  //     username: socket.handshake.auth.username,
  //   });
  // }

  // console.log(users);

  socket.on("disconnect", () => {
    console.log("disconnect");
    userCount--;
    io.emit("userCount", userCount);
  });
});

// const EventEmitter = require("events");
// const eventEmitter = new EventEmitter();

// eventEmitter.on("bebas", () => {
//   console.log("tes dari emit");
// });

// app.get("/tesEmit", (req, res) => {
//   eventEmitter.emit("bebas");
//   res.send({ message: "tes" });
// });

server.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
