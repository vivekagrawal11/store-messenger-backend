const { DataTypes } = require("sequelize");
const sequelize = require("../config/db"); // adjust path to your sequelize instance

const SiteConfig = sequelize.define(
  "SiteConfig",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true
    },
    name: {
      type: DataTypes.STRING(250),
      allowNull: false
    },
    slug: {
      type: DataTypes.STRING(50),
      allowNull: false,
      unique: true
    },
    value: {
      type: DataTypes.ENUM("0", "1"),
      defaultValue: "0"
    },
    options:{
       type: DataTypes.JSON, 
      allowNull: true,
    },
    config_type: {
      type: DataTypes.ENUM("int", "text", "select"),
      defaultValue: "int"
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: "site_sonfig", // your actual table name
    timestamps: false          // since you only have created_at
  }
);

module.exports = SiteConfig;
