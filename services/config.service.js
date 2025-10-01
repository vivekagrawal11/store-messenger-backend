const ConfigModel = require("../models/siteConfig.model");
const { User, Store, UserStore } = require("../models"); // make sure UserStore model is imported
const { Op } = require("sequelize");

class ConfigService {
    async allowToAddStore(store_id) {
    // Fetch store info
    const store = await Store.findOne({ where: { id: store_id } });
    if (!store) return { allowed: false, message: "Store not found" };

    // Check max agents from store.no_of_agents or fallback to config
    let maxAgents = store.no_of_agents;
    if (!maxAgents) {
      const config = await ConfigModel.findOne({
        where: { slug: "No_OF_AGENT_IN_STORE" },
      });
      maxAgents = config ? parseInt(config.value) : 0;
    }

    // Count already assigned agents
    const assignedCount = await UserStore.count({ where: { store_id } });

    // Check if new agent can be added
    const allowed = assignedCount <= maxAgents;

    return {
      allowed,
      storeName: store.name,
      maxAgents,
    };
  }

  async getConfigValue(slugId) {
     const config = await ConfigModel.findOne({
        where: { slug: slugId },
      });
      return config.value;
  }
}

module.exports = new ConfigService();
