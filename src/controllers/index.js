const authControllers = require("./authControllers");
const chauthControllers = require("./chauthControllers");
const productsControllers = require("./productsControllers");
const bukuControllers = require("./bukuControllers");
module.exports = {
  productsControllers,
  authControllers,
  chauthControllers,
  bukuControllers,
};

let today = new Date();
console.log(today);
let tomorrow = today.setDate(today.getDate() + 1);
console.log(new Date(tomorrow));
