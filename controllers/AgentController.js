const { User, Store } = require("../models"); // Import models from index.js
const bcrypt = require('bcrypt');
const ConfigService = require("../services/config.service");

module.exports = {

  // Get all agents with their stores
  getAgents: async (req, res) => {
    try {
      const agents = await User.findAll({
        where: { role: 'agent' },
        include: {
          model: Store,
          attributes: ['id'], // only fetch store IDs
          through: { attributes: [] } // remove pivot table fields
        }
      });

      // Map each agent to include only store_ids array
      const agentsWithStoreIds = agents.map(agent => ({
        id: agent.id,
        name: agent.name,
        email: agent.email,
        role: agent.role,
        store_ids: agent.Stores ? agent.Stores.map(s => s.id) : []
      }));

      res.json(agentsWithStoreIds);

    } catch (err) {
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Add new agent
  addAgent: async (req, res) => {
    try {
      const { store_ids, name, email, password } = req.body;
      if (!store_ids || !Array.isArray(store_ids) || store_ids.length === 0) {
        for (const id of store_ids) {
          const result = await ConfigService.allowToAddStore(id);

          if (!result.allowed) {
            return res.status(400).json({
              message: `Store "${result.storeName}" has reached maximum capacity of ${result.maxAgents} agents.`,
              type:"store"
            });
          }
        }
      }
      // Check for existing user
      const existingUser = await User.findOne({ where: { email } });
      if (existingUser) {
        return res.status(400).json({ message: "Email already exists",type:"email" });
      }

      // Hash password if needed
      const hashedPassword = password; // await bcrypt.hash(password, 10);

      // Create agent
      const agent = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'agent',
      });

      // Assign multiple stores
      if (store_ids && store_ids.length) {
        await agent.setStores(store_ids); // automatically inserts into pivot table
      }

      // Fetch agent with assigned stores
      const agentWithStores = await User.findByPk(agent.id, { include: Store });
      res.status(201).json(agentWithStores);

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Update agent
  updateAgent: async (req, res) => {
    try {
      const { id } = req.params;
      const { store_ids, name, email, password } = req.body;
      if (store_ids || Array.isArray(store_ids) || store_ids.length != 0) {
        for (const id of store_ids) {
          const result = await ConfigService.allowToAddStore(id);
          if (!result.allowed) {
            return res.status(400).json({
              message: `Store "${result.storeName}" has reached maximum capacity of ${result.maxAgents} agents.`,
              type:"store"
            });
          }
        }
      }
      const agent = await User.findByPk(id);
      if (!agent) return res.status(404).json({ message: 'Agent not found' });

      // Update basic info
      agent.name = name ?? agent.name;
      agent.email = email ?? agent.email;
      if (password) agent.password = password; // await bcrypt.hash(password, 10);

      await agent.save();

      // Update store assignments
      if (store_ids && Array.isArray(store_ids)) {
        await agent.setStores(store_ids); // replaces existing store relations
      }

      // Fetch updated agent with stores
      const updatedAgent = await User.findByPk(agent.id, { include: Store });
      res.json(updatedAgent);

    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },

};
