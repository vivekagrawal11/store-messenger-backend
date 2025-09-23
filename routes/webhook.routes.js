const express = require("express");
const router = express.Router();
const whatsappController = require("../controllers/webhookController");
const expressUrlencoded = express.urlencoded({ extended: false });

router.get("/webhook", whatsappController.verifyWebhook);

// Webhook message handler (POST)
router.post("/webhook",expressUrlencoded, whatsappController.handleWebhook);

module.exports = router;