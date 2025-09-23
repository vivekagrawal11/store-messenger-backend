const ChatService = require("../services/chat.service");

exports.getConversationMessages = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const messages = await ChatService.getMessages(conversationId);
    return res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch messages" });
  }
};

exports.getConversationUsers = async (req, res) => {
  try {
    const { role, id } = req.user;
    const messages = await ChatService.getConversationUser(role,id);
    return res.status(200).json(messages);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Failed to fetch messages" });
  }
};
