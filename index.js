const express = require("express");
const app = express();
const port = 5000;
// buat mengaktifkan req.body
app.use(express.json());
// buat upload foto dan reserve file
app.use(express.urlencoded({ extended: false }));

let products = [
  { id: 1, name: "popok hokage", price: 50000 },
  {
    id: 2,
    name: "pasir kazekage",
    price: 20000,
  },
  {
    id: 3,
    name: "Gurita adeknya raikage",
    price: 100000,
  },
];

app.get("/", (req, res) => {
  res.status(200).send({ message: "ini hellow" });
});
// req.query .. semua punya || query adalah value setelah tanda tanya
// di url
// req.params :semua punya
// req.body //tidak dimiliki get

app.get("/product", (req, res) => {
  console.log("query isi:", req.query); // req.query adalah object
  // object bisa di destructuring
  const { maxPrice, minPrice } = req.query;

  let filteredProd = products.filter((val) => {
    return (
      (maxPrice ? val.price <= maxPrice : true) &&
      (minPrice ? val.price >= minPrice : true)
    );
  });
  return res.send(filteredProd);
});

app.get("/product/category", (req, res) => {
  // console.log(productSelected);
  return res.send({ message: "tidak ada lol" });
});

app.get("/product/:id", (req, res) => {
  let { id } = req.params;
  // param adalah yang titik dua
  console.log(req.params);
  let productSelected = products.find((val) => val.id == id);
  console.log(productSelected);
  return res.send(productSelected);
});

app.delete("/product/:id", (req, res) => {
  let { id } = req.params;
  // cari index dengan id yang dimau
  let index = products.findIndex((val) => val.id == id);
  products.splice(index, 1);
  return res.send(products);
});

app.post("/product", (req, res) => {
  console.log(req.body);
  let data = { ...req.body, id: products[products.length - 1].id + 1 };
  products.push(data);
  // response all products
  return res.send(products);
});

app.put("/product/:id", (req, res) => {
  const { id } = req.params;
  // cari index
  let index = products.findIndex((val) => val.id == id);
  // validasi property req.body sama dengan product
  const arrProp = Object.keys(req.body); //['name','price']
  const productProp = Object.keys(products[index]); //['name','price','id']
  console.log(arrProp);
  console.log(productProp, "product");
  let lolosValidasi = true;
  arrProp.forEach((val) => {
    if (!productProp.includes(val)) {
      // jika val tidak ada di productsprop
      lolosValidasi = false;
    }
  });

  if (!lolosValidasi) {
    // jika ada property yang beda
    return res.status(500).send({ message: "property ada yang tidak sama" });
  }
  // property object req.body harus sama dengan property products
  products[index] = { ...products[index], ...req.body };
  return res.status(200).send(products);
});

app.listen(port, () => {
  console.log(`app listening on port ${port}`);
});
