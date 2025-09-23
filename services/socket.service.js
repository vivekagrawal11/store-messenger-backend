const jwt = require("jsonwebtoken");
const ChatService = require("./chat.service");
const { sendTextMessage} = require("./whatsapp.service");

function initSocket(io) {
  // ✅ Authenticate every incoming socket connection
  io.use((socket, next) => {
    try {
      // Get token from client
      const token = socket.handshake.auth.token || socket.handshake.headers["authorization"];

      if (!token) {
        return next(new Error("Authentication token missing"));
      }

      // Remove "Bearer " prefix if exists
      const jwtToken = token.startsWith("Bearer ") ? token.split(" ")[1] : token;

      // Verify token
      const decoded = jwt.verify(jwtToken, process.env.JWT_SECRET);

      // Attach user info to socket
      socket.user = decoded;
      next();
    } catch (err) {
      console.error("❌ Socket authentication failed:", err.message);
      next(new Error("Authentication failed"));
    }
  });

  // ✅ Handle socket events after authentication
  io.on("connection", (socket) => {
    console.log(`🔗 User connected: ${socket.id}, User ID: ${socket.user.id}, Role: ${socket.user.role}`);

    // ✅ Join a conversation room
    socket.on("joinConversation", (conversationId) => {
      socket.join(`conversation_${conversationId}`);
      console.log(`✅ User ${socket.user.id} joined conversation ${conversationId}`);
    });

    // ✅ Send message event
    socket.on("sendMessage", async (data) => {
      try {
        // Save the message to DB
        const message = await ChatService.saveMessage({
          ...data,
          agent_id: socket.user.id, 
          sender_type: 'agent',
        });
        sendTextMessage(data.customer_id,data.content);
        // Broadcast the message to everyone in the room
        /*io.to(`conversation_${data.conversation_id}`).emit("receiveMessage", {
          id: message.id,
          ...data,
          sender_id: socket.user.id,
          created_at: message.created_at,
        });*/
      } catch (error) {
        console.error("❌ Error saving message:", error);
      }
    });

    // ✅ Disconnect event
    socket.on("disconnect", () => {
      console.log(`❌ User disconnected: ${socket.id}`);
    });
  });
}

module.exports = initSocket;
