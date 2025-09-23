const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
require("dotenv").config();
const sequelize = require("./config/db");
const http = require("http");
const { Server } = require("socket.io");
const initSocket = require("./services/socket.service");
const webhookController = require('./controllers/webhookController')

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // You can set your Angular app URL here
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
const authRoutes = require("./routes/auth.routes");
const webhookRoutes = require("./routes/webhook.routes");
const chatRoutes = require("./routes/chat.routes");
const agentRoutes = require("./routes/agent.routes");
const storeRoutes = require("./routes/store.routes");

app.use("/api/auth", authRoutes);
app.use("/", webhookRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/stores", storeRoutes);
webhookController.setSocket(io);
// Initialize Socket.IO
initSocket(io);

// Sync DB with MySQL
sequelize.sync({ alter: false, force: false })
    .then(() => console.log("✅ Database synced successfully"))
    .catch(err => console.error("❌ Database sync failed:", err));

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
