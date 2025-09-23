const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhoneNumber = process.env.TWILIO_WHATSAPP_NUMBER;

const client = require('twilio')(accountSid, authToken);

// Send WhatsApp Interactive Buttons
exports.sendInteractiveOptionsButtons = async (to) => {
  try {
    const response = await client.messages.create({
      from: fromPhoneNumber, // Your Twilio WhatsApp number
      to: `whatsapp:${to}`,
      contentSid: 'HXb6b2f505557c0baa82334e12142bec2b',
    });

    console.log(`✅ Buttons sent successfully to ${to}`, response.sid);
  } catch (error) {
    console.error('❌ Error sending interactive buttons:', error);
  }
};

exports.sendInteractiveButtons = async (to) => {
   try {
    const response = await client.messages.create({
        from: fromPhoneNumber, // Your Twilio WhatsApp number
        to: `whatsapp:${to}`,
        contentSid: 'HXdd1504b9cd14b4b3cb348a4430a8040a',
      });

      console.log(`✅ Buttons sent successfully to ${to}`, response.sid);
    } catch (error) {
      console.error('❌ Error sending interactive buttons:', error);
    }
};



// Send store list if user selects city
/*exports.sendStoreList = async (to, stores) => {
  try {
    // Build store options for WhatsApp list
    const options = stores.map(store => ({
      id: `STORE_${store.id}`,
      title: store.name.substring(0, 24), // ✅ Twilio/WhatsApp max 24 chars
      description: store.address ? store.address.substring(0, 72) : "" // optional
    }));

    // Send WhatsApp list message
    const message = await client.messages.create({
      from: fromPhoneNumber, // your Twilio WhatsApp number
      to: `whatsapp:${to}`,
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
    });

    console.log(`✅ Store list sent successfully to ${to}, SID: ${message.sid}`);
    return message;
  } catch (error) {
    console.error("❌ Error sending store list:", error.message || error);
  }
};*/
exports.sendStoreList = async (to, contentSid) => {
  try {
    // Build store options for WhatsApp list
    /*const options = stores.map(store => ({
      id: `STORE_${store.id}`,
      title: store.name.substring(0, 24), // ✅ Twilio/WhatsApp max 24 chars
      description: store.address ? store.address.substring(0, 72) : "" // optional
    }));*/

    // Send WhatsApp list message
    const response = await client.messages.create({
        from: fromPhoneNumber, // Your Twilio WhatsApp number
        to: `whatsapp:${to}`,
        contentSid: contentSid,
    });

    console.log(`✅ Store list sent successfully to ${to}, SID: ${message.sid}`);
  } catch (error) {
    console.error("❌ Error sending store list:", error.message || error);
  }
};
exports.sendCityList = async (to, cities) => {
  try {
    // Build city options for WhatsApp list
    const options = cities.map(city => ({
      id: `CITY_${city.city}`,
      title: city.city.substring(0, 24), // ✅ Max 24 chars
      description: city.state ? city.state.substring(0, 72) : "" // optional
    }));
    const response = await client.messages.create({
        from: fromPhoneNumber, // Your Twilio WhatsApp number
        to: `whatsapp:${to}`,
        contentSid: 'HXf24a5e8d2c2916301aec52b0e2d5b0a9',
      });
    // Send WhatsApp list message
    /*const message = await client.messages.create({
      from: fromPhoneNumber, // your Twilio WhatsApp number
      to: `whatsapp:${to}`,
      interactive: {
        type: "list",
        body: {
          text: "Select city to continue:"
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
    });*/
    console.log(`✅ City list sent successfully to ${to}, SID: ${response.sid}`);
  } catch (error) {
    console.error("❌ Error sending city list:", error.message || error);
  }
};
// Send simple text message
exports.sendTextMessage = async (to, text) => {
  try {
    const message = await client.messages.create({
      from: fromPhoneNumber, // ✅ your Twilio WhatsApp number
      to: `whatsapp:${to}`,
      body: text
    });
    console.log('message send');
    console.log(`✅ Text message sent to ${to}, SID: ${message.sid}`);
    return message;
  } catch (error) {
    console.error("❌ Error sending text message:", error.message || error);
  }
};

exports.sendLocationRequest = async (to, text) => {
  try {
    const message = await client.messages.create({
      from: "whatsapp:+14155238886", // ✅ your Twilio WhatsApp number
      to: `whatsapp:${to}`,
      body: text || "📍 Please share your location"
    });

    console.log(`✅ Location request sent to ${to}, SID: ${message.sid}`);
    return message;
  } catch (error) {
    console.error("❌ Error sending location request:", error.message || error);
  }
};
