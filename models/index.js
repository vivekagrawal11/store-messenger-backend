const User = require("./user.model");
const Store = require("./store.model");
const UserStore = require("./user_stores.model");

// Define many-to-many associations
User.belongsToMany(Store, { through: UserStore, foreignKey: "user_id" });
Store.belongsToMany(User, { through: UserStore, foreignKey: "store_id" });

module.exports = { User, Store, UserStore };