const { DataTypes } = require("sequelize");
const sequelize = require("../config/db");

const WhatsappMessage = sequelize.define("whatsapp_messages", {
  id: { type: DataTypes.BIGINT, autoIncrement: true, primaryKey: true },
  conversation_id: { type: DataTypes.BIGINT, allowNull: false },
  store_id: { type: DataTypes.BIGINT },
  message_id: { type: DataTypes.STRING },
  from_whatsapp_id: { type: DataTypes.STRING },
  to_whatsapp_id: { type: DataTypes.STRING },
  direction: { type: DataTypes.ENUM("in", "out"), allowNull: false },
  sender_type: { type: DataTypes.ENUM("customer", "bot", "agent", "system"), allowNull: false },
  agent_id: { type: DataTypes.BIGINT },
  content: { type: DataTypes.TEXT },
  attachments: { type: DataTypes.JSON },
  message_type: { type: DataTypes.STRING },
  provider_payload: { type: DataTypes.JSON },
  delivered_at: { type: DataTypes.DATE },
  read_at: { type: DataTypes.DATE },
}, {
  timestamps: true,
  createdAt: "created_at",
  updatedAt: false,
});

module.exports = WhatsappMessage;
