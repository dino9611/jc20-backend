const express = require("express");
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

const multer = require("multer");
const fs = require("fs");
//? destination nantinya bebas mau diisi apa dengan user yang jelas isi path
//? fileNamePrefix adalah nama depan filenya nanti
const upload = (destination, fileNamePrefix) => {
  // default path adalah folder public
  const defaultPath = "./public";
  const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      console.log("line 15 isi file : ", file);
      const dir = defaultPath + destination;
      if (fs.existsSync(dir)) {
        // ngecek apakah directory sudah ada atau belum
        console.log(dir, "exist");
        cb(null, dir);
      } else {
        // jika dir tidak ditemukan maka buat folder
        fs.mkdir(dir, { recursive: true }, (err) => cb(err, dir));
        console.log(dir, "make");
      }
    },
    filename: function (req, file, cb) {
      let originalName = file.originalname; // isinya adalah nama file yang dikirim dari user
      let ext = originalName.split("."); // nama file 'dino.png' -> [dino,png]
      let filename = fileNamePrefix + Date.now() + "." + ext[ext.length - 1]; // ext[ext.length - 1] = png
      cb(null, filename);
    },
  });

  const fileFilter = (req, file, cb) => {
    // tambahkan extention yang mau di upload jika tidak ada disini
    const ext = /\.(jpg|jpeg|png|gif|pdf|doc|docx|xlsx|JPEG)$/; //regex
    if (!file.originalname.match(ext)) {
      return cb(new Error("Only selected file type are allowed"), false);
    }
    cb(null, true);
  };

  return multer({
    storage: storage,
    fileFilter: fileFilter,
    limits: {
      fileSize: 2 * 1024 * 1024, //2mb
    },
  });
};

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
