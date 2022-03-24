const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize(
  process.env.MYSQL_DATABASE,
  process.env.MYSQL_USERNAME,
  process.env.MYSQL_PASS,
  {
    host: "localhost",
    dialect: "mysql",
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000,
    },
    timezone: "+07:00",
  }
);

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

db.products = sequelize.define("products", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(45), // default varchar(255)
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  description: {
    type: DataTypes.STRING,
  },
});

db.variaties = sequelize.define("variaties", {
  id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    primaryKey: true,
    autoIncrement: true,
  },
  name: {
    type: DataTypes.STRING(45), // default varchar(255)
    allowNull: false,
  },
  color: {
    type: DataTypes.STRING(45), // default varchar(255)
    allowNull: false,
  },
  images: {
    type: DataTypes.JSON,
  },
});
// relation product and variaties
db.products.hasMany(db.variaties, {
  foreignKey: "product_id",
});

db.variaties.belongsTo(db.products, {
  foreignKey: "product_id",
});
// relation product and variaties

module.exports = db;
