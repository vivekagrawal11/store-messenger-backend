const axios = require("axios");

const PHONE_NUMBER_ID = process.env.WHATSAPP_PHONE_NUMBER_ID;
const WHATSAPP_API_URL = `${process.env.WHATSAPP_API_URL}/${PHONE_NUMBER_ID}/messages`;
const TOKEN = process.env.WHATSAPP_TOKEN;

// Send interactive buttons (Location / City)
exports.sendInteractiveOptionsButtons = async (to) => {
    try {
        // Define buttons safely
        const buttons = [
            { id: "ORDER", title: "Previous Order" },
            { id: "LATS_ORDER_STATUS", title: "Order Status" },
            { id: "AGENT", title: "Connect Agent" }
        ];

        // Truncate button titles if needed
        const safeButtons = buttons.map(btn => ({
            type: "reply",
            reply: {
                id: btn.id,
                title: btn.title.substring(0, 20) // ✅ Ensures max 20 chars
            }
        }));

        await axios.post(
            WHATSAPP_API_URL,
            {
                messaging_product: "whatsapp",
                to,
                type: "interactive",
                interactive: {
                    type: "button",
                    body: {
                        text: "Hi! 👋 Please choose one of the options below:"
                    },
                    action: {
                        buttons: safeButtons
                    }
                }
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${TOKEN}`
                }
            }
        );

        console.log(`✅ Buttons sent successfully to ${to}`);
    } catch (error) {
        console.error("❌ Error sending interactive buttons:", error.response?.data || error);
    }
};
exports.sendInteractiveButtons = async (to) => {
    try {
        // Define buttons safely
        const buttons = [
            { id: "LOCATION", title: "📍 Share Location" },
            { id: "CITY", title: "🏙️ Select City" }
        ];

        // Truncate button titles if needed
        const safeButtons = buttons.map(btn => ({
            type: "reply",
            reply: {
                id: btn.id,
                title: btn.title.substring(0, 20) // ✅ Ensures max 20 chars
            }
        }));

        await axios.post(
            WHATSAPP_API_URL,
            {
                messaging_product: "whatsapp",
                to,
                type: "interactive",
                interactive: {
                    type: "button",
                    body: {
                        text: "Hi! 👋 Please choose one of the options below:"
                    },
                    action: {
                        buttons: safeButtons
                    }
                }
            },
            {
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${TOKEN}`
                }
            }
        );

        console.log(`✅ Buttons sent successfully to ${to}`);
    } catch (error) {
        console.error("❌ Error sending interactive buttons:", error.response?.data || error);
    }
};


// Send store list if user selects city
exports.sendStoreList = async (to, stores) => {
    try {
        const options = stores.map(store => ({
            id: `STORE_${store.id}`,
            title: store.name
        }));

        return await axios.post(
            WHATSAPP_API_URL,
            {
                messaging_product: "whatsapp",
                to,
                type: "interactive",
                interactive: {
                    type: "list",
                    body: {
                        text: "Select your preferred store to continue:"
                    },
                    action: {
                        button: "Choose Store",
                        sections: [
                            {
                                title: "Available Stores",
                                rows: options
                            }
                        ]
                    }
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );
    } catch (error) {
        console.error("Error sending store list:", error.response?.data || error.message);
    }
};
exports.sendCityList = async (to, cities) => {
    try {
        const options = cities.map(city => ({
            id: `CITY_${city.city}`,
            title: city.city
        }));

        return await axios.post(
            WHATSAPP_API_URL,
            {
                messaging_product: "whatsapp",
                to,
                type: "interactive",
                interactive: {
                    type: "list",
                    body: {
                        text: "Select Select city to continue:"
                    },
                    action: {
                        button: "Choose City",
                        sections: [
                            {
                                title: "Available Cities",
                                rows: options
                            }
                        ]
                    }
                }
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );
    } catch (error) {
        console.error("Error sending store list:", error.response?.data || error.message);
    }
};
// Send simple text message
exports.sendTextMessage = async (to, text) => {
    console.log(WHATSAPP_API_URL);
    try {
        return await axios.post(
            WHATSAPP_API_URL,
            {
                messaging_product: "whatsapp",
                to,
                text: { body: text }
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );
    } catch (error) {
        console.error("Error sending text message:", error.response?.data || error.message);
    }
};

exports.sendLocationRequest = async (to, text) => {
    try {
        return await axios.post(
            WHATSAPP_API_URL,
            {
                messaging_product: "whatsapp",
                to,
                text: { body: text }
            },
            {
                headers: {
                    Authorization: `Bearer ${TOKEN}`,
                    "Content-Type": "application/json"
                }
            }
        );
    } catch (error) {
        console.error("Error sending text message:", error.response?.data || error.message);
    }
};
