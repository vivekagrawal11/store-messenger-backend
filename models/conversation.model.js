const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const Conversation = sequelize.define("conversations", {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  store_id: { type: DataTypes.BIGINT },
  customer_id: { type: DataTypes.BIGINT },
  channel: { type: DataTypes.STRING, defaultValue: "whatsapp" },
  status: { type: DataTypes.ENUM("bot", "queued", "agent", "closed"), defaultValue: "bot" },
  profilename:{ type: DataTypes.STRING(250) },
  assigned_agent_id: { type: DataTypes.BIGINT },
  queued_at: { type: DataTypes.DATE },
  started_at: { type: DataTypes.DATE },
  ended_at: { type: DataTypes.DATE },
  last_message_at: { type: DataTypes.DATE },
  metadata: { type: DataTypes.JSON },
}, {
  timestamps: true,
  createdAt: "created_at",
  updatedAt: "updated_at",
});

module.exports = Conversation;
