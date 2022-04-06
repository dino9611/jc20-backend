const express = require("express");
const { verifyTokenAccess } = require("../lib/verifyToken");
const Router = express.Router();
const { bukuControllers } = require("./../controllers");
const { addBuku } = bukuControllers;
const upload = require("../lib/upload");

const uploader = upload("/books", "BOOK").fields([
  { name: "books", maxCount: 3 },
]);
const validateAdmin = (req, res, next) => {
  if (req.user.roles_id === 1) {
    // admin roles_idnya 1
    next();
  } else {
    return res.status(401).send({ message: "user unauthorized" });
  }
};

Router.post("/", verifyTokenAccess, validateAdmin, uploader, addBuku);

module.exports = Router;
