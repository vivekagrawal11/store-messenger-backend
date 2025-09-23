const WhatsappMessage = require("../models/whatsappMessage.model");
const Conversation = require("../models/conversation.model");
const User = require("../models/user.model");
const { Op } = require("sequelize");

class ChatService {
  async saveMessage({ conversation_id, store_id,content,direction='out',customer_id,agent_id, sender_type = "agent"}) {
    return await WhatsappMessage.create({
      conversation_id,
      store_id,
      agent_id,
      content,
      direction: direction,
      sender_type,
      to_whatsapp_id :customer_id
    });
  }

  async getMessages(conversation_id) {
    return await WhatsappMessage.findAll({
      where: { conversation_id },
      order: [["created_at", "ASC"]],
    });
  }
  async getConversationUser(role, userId) {
    try {
      let whereCondition = {
        status: {
          [Op.ne]: "closed" // Exclude closed conversations
        }
      };

      if (role === "agent") {
        // Fetch the user's store_id
        const user = await User.findByPk(userId);
        if (!user || !user.store_id) {
          return []; // If agent has no store, return empty list
        }
        whereCondition.store_id = user.store_id; // Filter by store
      }

      // For super_admin → no store filter, fetch all open conversations
      return await Conversation.findAll({
        where: whereCondition,
        order: [["created_at", "DESC"]],
      });

    } catch (error) {
      console.error("Error fetching conversations:", error);
      throw new Error("Failed to fetch conversations");
    }
  }
}

module.exports = new ChatService();
