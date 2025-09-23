const express = require("express");
const router = express.Router();
const chatController = require("../controllers/chat.controller");
const auth = require("../middleware/authMiddleware");

router.get("/conversation/:conversationId",auth,chatController.getConversationMessages);
router.get("/users",auth,chatController.getConversationUsers);

module.exports = router;
