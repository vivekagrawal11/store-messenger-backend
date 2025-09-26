// user.model.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");
const Store = require("./store.model");
const UserStore = require("./user_stores.model");

const User = sequelize.define("User", {
    id: { type: DataTypes.BIGINT.UNSIGNED, autoIncrement: true, primaryKey: true },
    name: { type: DataTypes.STRING, allowNull: false },
    email: { type: DataTypes.STRING, unique: true, allowNull: false },
    password: { type: DataTypes.STRING, allowNull: false },
    role: { type: DataTypes.ENUM("super_admin","store_admin","agent"), defaultValue: "agent" },
}, {
    timestamps: true,
    tableName: "users",
});

module.exports = User;
