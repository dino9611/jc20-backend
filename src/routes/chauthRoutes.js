const express = require("express");
const { verifyTokenAccess } = require("../lib/verifyToken");
const Router = express.Router();
const { chauthControllers } = require("./../controllers");
const { register, login, deactiveUser } = chauthControllers;

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

const validateAdmin = (req, res, next) => {
  if (req.user.roles_id === 1) {
    // admin roles_idnya 1
    next();
  } else {
    return res.status(401).send({ message: "user unauthorized" });
  }
};

Router.post("/register", middlewareValidate, register);
Router.post("/login", login);
Router.patch("/deactivate", verifyTokenAccess, validateAdmin, deactiveUser);

module.exports = Router;
