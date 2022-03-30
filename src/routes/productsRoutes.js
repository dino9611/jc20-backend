const express = require("express");
const upload = require("../lib/upload");
const router = express.Router();
const { productsControllers } = require("./../controllers");
const {
  getProduct,
  getProductDetail,
  addProductUpload,
  editProduct,
  deleteProduct,
  addproduct,
} = productsControllers;

//? destination nantinya bebas mau diisi apa dengan user yang jelas isi path
//? fileNamePrefix adalah nama depan filenya nanti

const uploader = upload("/products", "PROD").fields([
  { name: "products", maxCount: 3 },
]);

router.get("/", getProduct);
router.get("/:id", getProductDetail);
router.delete("/:id", deleteProduct);
// ? tanpa upload
// router.post("/", addproduct);
// dengan upload
router.post("/", uploader, addProductUpload);

router.put("/:id", uploader, editProduct);

module.exports = router;
