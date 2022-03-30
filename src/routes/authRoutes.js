const express = require("express");
const Router = express.Router();
const { authControllers } = require("./../controllers");
const { register, login, keeplogin } = authControllers;

Router.post("/register", register);
Router.post("/login", login);
Router.get("/keeplogin/:id", keeplogin);

module.exports = Router;
