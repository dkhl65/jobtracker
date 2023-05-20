const { DataTypes } = require("sequelize");
const sequelize = require("../database");
const User = require("./user");

const Job = sequelize.define(
  "job",
  {
    username: {
      type: DataTypes.STRING,
    },
    company: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    location: {
      type: DataTypes.STRING,
    },
    remote: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
    },
    link: {
      type: DataTypes.STRING,
    },
    application: {
      type: DataTypes.STRING,
    },
    assessment: {
      type: DataTypes.STRING,
    },
    interview: {
      type: DataTypes.STRING,
    },
    rejection: {
      type: DataTypes.STRING,
    },
    notes: {
      type: DataTypes.TEXT,
    },
  },
  {
    timestamps: false,
  }
);
User.hasMany(Job, { foreignKey: "username", sourceKey: "username" });

Job.sync().catch((err) => console.error(err));

module.exports = Job;
