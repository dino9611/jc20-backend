const express = require("express");
const { verifyTokenAccess } = require("../lib/verifyToken");
const Router = express.Router();
const { chauthControllers } = require("./../controllers");
const { register, login } = chauthControllers;

const middlewareValidate = (req, res, next) => {
  const { password, confirmpassword } = req.body;
  try {
    // validasi
    if (password != confirmpassword) {
      throw { message: "confirm tidak sama dengan password" };
    }

    //   cek jumlah karakter
    if (!new RegExp("(?=.{8,})").test(password)) {
      // kalo tidak 8 karacter masuk sini
      throw { message: "harus 8 karakter" };
    }
    //   cek ada huruf
    if (!new RegExp("([a-zA-Z])").test(password)) {
      // tidak ada huruf
      throw { message: "harus ada huruf" };
    }
    //   cek ada angka atau tidak
    if (!new RegExp("([0-9])").test(password)) {
      // tidak ada angka
      throw { message: "harus ada angka" };
    }
    // buat next ke controller selanjutnya
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).send({ message: error.message || error });
  }
};

Router.post("/register", middlewareValidate, register);
Router.post("/login", login);

module.exports = Router;
