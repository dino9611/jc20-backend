const { DataTypes } = require("sequelize");
const sequelize = require("./../lib/sequelize");

module.exports = sequelize.define("variaties", {
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
