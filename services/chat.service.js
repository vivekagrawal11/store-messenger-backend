const WhatsappMessage = require("../models/whatsappMessage.model");
const Conversation = require("../models/conversation.model");
const { User, Store} = require("../models");
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
        // Fetch the stores assigned to this agent
        const user = await User.findByPk(userId, {
          include: {
            model: Store,
            attributes: ['id'], // only need IDs
            through: { attributes: [] } // remove pivot fields
          }
        });

        if (!user || !user.Stores || !user.Stores.length) {
          return []; // No stores assigned
        }

        // Extract store IDs
        const storeIds = user.Stores.map(store => store.id);
        whereCondition.store_id = { [Op.in]: storeIds }; // filter conversations by multiple stores
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
