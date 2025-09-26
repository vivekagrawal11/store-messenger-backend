const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const User = require("./user.model");
const UserStore = require("./user_stores.model");

const Store = sequelize.define("Store", {
  id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
  name: { type: DataTypes.STRING(191), allowNull: false },
  phone_number: { type: DataTypes.STRING(32), allowNull: true },
  whatsapp_phone_id: { type: DataTypes.STRING(128), allowNull: true },
  business_account_id: { type: DataTypes.STRING(128), allowNull: true },
  description: { type: DataTypes.TEXT, allowNull: true },
  address: { type: DataTypes.TEXT('medium'), allowNull: true },
  city: { type: DataTypes.STRING(100), allowNull: true },
  state: { type: DataTypes.STRING(100), allowNull: true },
  postcode: { type: DataTypes.STRING(32), allowNull: true },
  country: { type: DataTypes.STRING(100), allowNull: true },
  config: { type: DataTypes.JSON, allowNull: true },
  latitude: { type: DataTypes.DECIMAL(10, 8), allowNull: true },
  longitude: { type: DataTypes.DECIMAL(11, 8), allowNull: true },
  created_at: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
  updated_at: { type: DataTypes.DATE, allowNull: true, defaultValue: DataTypes.NOW },
  deleted_at: { type: DataTypes.DATE, allowNull: true },
}, {
  tableName: "stores",
  timestamps: false,
  paranoid: true,
});


module.exports = Store;
