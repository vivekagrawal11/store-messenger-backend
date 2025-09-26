const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const UserStore = sequelize.define("UserStore", {
    user_id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true },
    store_id: { type: DataTypes.BIGINT.UNSIGNED, primaryKey: true },
}, {
    tableName: "user_stores",
    timestamps: false,
});

module.exports = UserStore;