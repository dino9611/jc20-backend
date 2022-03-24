const { Sequelize, DataTypes } = require("sequelize");

const sequelize = require("./../lib/sequelize");

sequelize
  .authenticate()
  .then(() => {
    console.log("connect sequelize successfully");
  })
  .catch(() => {
    console.log("gagal connect sequelize");
  });

const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.products = require("./productsModel")(sequelize, DataTypes);
db.variaties = require("./variatiesModel");
// relation product and variaties
db.products.hasMany(db.variaties, {
  foreignKey: "product_id",
});

db.variaties.belongsTo(db.products, {
  foreignKey: "product_id",
});
// relation product and variaties

module.exports = db;
