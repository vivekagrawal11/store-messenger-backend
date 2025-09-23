const db = require("../config/db");
const ChatService = require("../services/chat.service");
const { sendInteractiveButtons, sendStoreList, sendTextMessage ,sendCityList,sendInteractiveOptionsButtons} = require("../services/whatsapp.service");
const { QueryTypes } = require("sequelize");

let io; // We'll set this from server.js

exports.setSocket = (socketIo) => {
  io = socketIo;
};
exports.verifyWebhook = (req, res) => {
    try {
        const verifyToken = process.env.WHATSAPP_VERIFY_TOKEN;
        const mode = req.query["hub.mode"];
        const token = req.query["hub.verify_token"];
        const challenge = req.query["hub.challenge"];

        if (mode && token && mode === "subscribe" && token === verifyToken) {
            console.log("✅ Webhook verified successfully!");
            return res.status(200).send(challenge);
        } else {
            console.error("❌ Webhook verification failed");
            return res.sendStatus(403);
        }
    } catch (error) {
        console.error("Webhook verification error:", error);
        return res.sendStatus(500);
    }
};
exports.handleWebhook = async (req, res) => {
    try {
        const data = req.body;
        console.log(data);
        if (!data ||  data.SmsStatus != 'received') {
            return res.sendStatus(400);
        }

        const message = data.Body;
        const from = data.WaId; // WhatsApp user number
        const type = data.MessageType;
        const profilename = data.ProfileName;

        console.log("Incoming Message:", message);

        // 1. Check if conversation already exists
        const conversations = await db.query(
            "SELECT * FROM conversations WHERE customer_id = :customer_id AND channel = 'whatsapp' AND status != 'closed' LIMIT 1",
            {
                replacements: { customer_id: from },
                type: QueryTypes.SELECT,
            }
        ); 
        let conversation = conversations.length ? conversations[0] : null;

        // 2. If active conversation exists and store_id is set → Continue chat
        if (conversation && conversation.store_id) {
            const savedMessage = await ChatService.saveMessage({
                  conversation_id : conversation.id,
                  store_id : conversation.store_id,
                  content: message || "[Non-text message]",
                  direction: 'in',
                  sender_type : 'customer',
                  from_whatsapp_id :conversation.customer_id
            });
              // 4. Emit message via socket to Angular
            if (io) {
                try {
                    io.to(`conversation_${conversation.id}`).emit("receiveMessage", {
                        conversation_id: conversation.id,
                        store_id: conversation.store_id,
                        content: savedMessage.content,
                        timestamp: savedMessage.created_at,
                        direction: "in",
                        customer_id:conversation.customer_id
                    });
                }catch (error) {
                console.error("❌ Error saving message:", error);
              }
            }
            const userMessage = message?.toLowerCase();
            const bots = await db.query(
              `SELECT * FROM chatbot_flows 
               WHERE active = 1 
                 AND JSON_CONTAINS(match_rules, :keyword, '$') 
               LIMIT 1`,
              { 
                replacements: { keyword: `"${userMessage}"` }, 
                type: QueryTypes.SELECT 
              }
            );
            if (bots.length > 0 && (conversation.status == 'bot' || conversation.status == 'closed' )) {
                const botReply = bots[0].response; // JSON column, contains {"text": "..."}
                await sendTextMessage(conversation.customer_id, botReply.text);
                const savedMessage = await ChatService.saveMessage({
                  conversation_id: conversation.id,
                  store_id: conversation.store_id,
                  content: botReply.text,
                  direction: 'out',
                  sender_type: 'bot',
                  from_whatsapp_id: conversation.customer_id
                });
                if (io) {
                    try {
                        io.to(`conversation_${conversation.id}`).emit("receiveMessage", {
                            conversation_id: conversation.id,
                            store_id: conversation.store_id,
                            content: botReply.text,
                            timestamp: savedMessage.created_at,
                            direction: "out",
                            customer_id:conversation.customer_id
                        });
                    }catch (error) {
                    console.error("❌ Error saving message:", error);
                  }
                }
            }
            return;
            //return res.sendStatus(200);
        }

        // 3. If no conversation exists → Create a new one
        if (!conversation) {
            const [result] = await db.query(
                "INSERT INTO conversations (customer_id, channel, status,profilename) VALUES (:customer_id, 'whatsapp', 'bot',:profilename)",
                {
                    replacements: { customer_id: from ,profilename:profilename},
                    type: QueryTypes.INSERT,
                }
            );
            conversation = { id: result, customer_id: from };
        }

        // 4. Handle message types
        if (type === "text") {
            await sendInteractiveOptionsButtons(from);
        }
        else if (type === "location") {
            const latitude = data.Latitude;
            const longitude = data.Longitude;
            const stores = await db.query(
                `SELECT id, name, latitude, longitude,
                ( 6371 * acos( cos( radians(:lat) ) * cos( radians(latitude) )
                * cos( radians(longitude) - radians(:lng) ) + sin( radians(:lat) ) * sin( radians(latitude)) ) ) AS distance
                FROM stores
                ORDER BY distance ASC LIMIT 1`,
                {
                    replacements: { lat: latitude, lng: longitude },
                    type: QueryTypes.SELECT,
                }
            );

            if (stores.length > 0) {
                const store = stores[0];

                await db.query(
                    "UPDATE conversations SET store_id = :store_id WHERE id = :id",
                    {
                        replacements: { store_id: store.id, id: conversation.id },
                        type: QueryTypes.UPDATE,
                    }
                );
                await sendTextMessage(from, `Nearest store selected: ${store.name}. How can we assist you?`);
                 io.emit("userAdded", {
                  id: conversation.id,
                  profilename: conversation.profilename,
                  store_id: store.id,
                  customer_id: conversation.customer_id
                });
            } else {
                await sendTextMessage(from, "No nearby stores found. Please select a city instead.");
                await sendStoreList(from, stores);
            }
        }
        else if (type === "interactive") {
            const interactiveType = data.ButtonText;

            if (data.ButtonText) {
                const buttonId = data.ButtonText;
                console.log(buttonId);
                if(buttonId === "AGENT"){
                    await sendInteractiveButtons(from);
                    await db.query(
                        "UPDATE conversations SET status = :agent WHERE id = :id",
                        {
                            replacements: { agent:'agent' , id: conversation.id },
                            type: QueryTypes.UPDATE,
                        }
                    );
                } else if(buttonId === "Select City") {
                    // ✅ Fetch all cities from DB
                    const cities = await db.query(
                        "SELECT DISTINCT city FROM stores ORDER BY city",
                        { type: QueryTypes.SELECT }
                    );

                    if (cities.length > 0) {
                        await sendCityList(from, cities, true);
                    } else {
                        await sendTextMessage(from, "⚠️ Sorry, no cities found in our database.");
                    }
                } else if(buttonId === "📍 Share Location") {
                        console.log('test');
                        await sendTextMessage(
                            from,
                            "📍 Please share your live location so we can find the nearest store."
                        );
                } 
            } 
            // ✅ NEW: Handle list reply for city selection
            else if (data.ListId) {
                const selectedId = data.ListId;

                if (selectedId.startsWith("CITY_")) {
                    const city = selectedId.replace("CITY_", "");

                   /* const stores = await db.query(
                        "SELECT * FROM stores WHERE city = :city ORDER BY name",
                        {
                            replacements: { city },
                            type: QueryTypes.SELECT,
                        }
                    );*/
                    if(city == 'hammersmith'){
                        storetem = 'HXc455b5ad43ed721f24f4bd964fc0a9e0';
                    }else if(city == 'victoria'){
                        storetem = 'HX6976d8bda56f451244daaa0c2d57438a';   
                    }else{
                        storetem = null;
                    }
                    if (storetem) {
                        await sendStoreList(from, storetem);
                    } else {
                        await sendTextMessage(from, `⚠️ No stores found in ${city}.`);
                    }
                }else if (selectedId.startsWith("STORE_")) {
                    const storeId = selectedId.replace("STORE_", "");

                    await db.query(
                        "UPDATE conversations SET store_id = :store_id WHERE id = :id",
                        {
                            replacements: { store_id: storeId, id: conversation.id },
                            type: QueryTypes.UPDATE,
                        }
                    );
                    io.emit("userAdded", {
                      id: conversation.id,
                      profilename: conversation.profilename,
                      store_id: storeId,
                      customer_id: conversation.customer_id
                    });

                    await sendTextMessage(from, "✅ Store selected successfully! How can we assist you?");
                }
            }
        }
    } catch (error) {
        console.error("Webhook Error:", error);
        res.sendStatus(500);
    }
};

