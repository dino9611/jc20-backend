// const mongoose = require("mongoose");

// const mongoConnect = mongoose.connect(
//   `mongodb+srv://dino9611:pwdk123@cluster0.ydv5x.mongodb.net/jc20latmongo?retryWrites=true&w=majority`
// );

// mongoConnect
//   .then(() => {
//     console.log("connected mongodb");
//   })
//   .catch((err) => console.log(err));

// const userSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       unique: true,
//       required: true, // klo true sama harus ada
//       set: (val) => val.replace(/ /g, ""), // buathapus spasi
//       validate: (val) => {
//         //membuat validasi
//         if (!isNaN(parseInt(val))) {
//           // if the incoming value is numbers
//           throw new Error("Name cannot be only numbers");
//         }
//       },
//     },
//     email: {
//       type: String,
//       unique: true,
//       required: true,
//     },
//     password: {
//       type: String,
//       required: true,
//       minlength: 8,
//     },
//     posts: [
//       {
//         type: mongoose.Schema.Types.ObjectId,
//         ref: "Posts",
//       },
//     ],
//   },
//   { timestamps: true }
// );

// const Users = mongoose.model("Users", userSchema);

// const postSchema = new mongoose.Schema(
//   {
//     content: {
//       type: String,
//     },
//     image: {
//       type: String,
//     },
//     likes: [
//       { default: [], type: mongoose.Schema.Types.ObjectId, ref: "Users" },
//     ],
//     comments: [
//       {
//         default: {},
//         user: {
//           type: mongoose.Schema.Types.ObjectId,
//           ref: "Users",
//         },
//         comment: {
//           type: String,
//         },
//       },
//     ],
//     user: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Users",
//     },
//   },
//   { timestamps: true }
// );

// const Posts = mongoose.model("Posts", postSchema);

// app.post("/auth/register", async (req, res) => {
//   // req.body sudah sesuai dengan schema
//   try {
//     // add data to users
//     const user = new Users({ ...req.body });
//     await user.save();
//     return res.status(200).send({ message: "berhasil add data" });
//   } catch (error) {
//     return res.status(500).send({ message: error.message || error });
//   }
// });

// app.post("/post/:iduser", async (req, res) => {
//   // req.body sudah sesuai dengan schema
//   try {
//     const { iduser } = req.params;
//     // add data to users
//     const post = new Posts({ ...req.body, user: iduser });
//     // edit user untuk push postingan
//     console.log(post);
//     // find user
//     const user = await Users.findById(iduser);
//     // edit seperti javascript
//     console.log(user);
//     user.posts = [...user.posts, post._id];
//     // edit harus di save
//     await user.save();
//     await post.save();
//     return res.status(200).send({ message: "berhasil add post" });
//   } catch (error) {
//     return res.status(500).send({ message: error.message || error });
//   }
// });

// app.get("/user", async (req, res) => {
//   try {
//     // cara 1
//     // const user = await Users.find({ username: "dinoaja" }).populate("posts", [
//     //   "content",
//     //   "image",
//     // ]);

//     // delete user
//     // const user = await User.findById(req.params.id);
//     // user.remove();

//     // cara 2
//     // select * from users where email = dika and username = 'dino aja'
//     // const user = await Users.where("email")
//     //   .equals("dika@gmail.com")
//     //   .where("username")
//     //   .equals("dinoaja")
//     //   .select(["username", "email"]);
//     // kalo tidak pake or
//     // const user = await Users.where("username")
//     //   .equals("dinoaja")
//     //   .select(["username", "email"]);

//     console.log(user);
//     return res.status(200).send(user);
//   } catch (error) {
//     return res.status(500).send({ message: error.message || error });
//   }
// });
