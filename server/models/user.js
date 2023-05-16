const { DataTypes } = require("sequelize");
const sequelize = require("../database");

const User = sequelize.define(
  "user",
  {
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    refreshToken: {
      type: DataTypes.STRING,
    },
  },
  {
    timestamps: false,
  }
);

User.sync().catch((err) => console.error(err));

module.exports = User;
