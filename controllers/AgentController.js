const User = require("../models/user.model");
const bcrypt = require('bcrypt');

module.exports = {

  // Get all agents
  getAgents: async (req, res) => {
    try {
      const agents = await User.findAll({ where: { role: 'agent' } });
      res.json(agents);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Add new agent
  addAgent: async (req, res) => {
    try {
      const { store_id, name, email, password } = req.body;

      // Hash password
      const hashedPassword = password ; //await bcrypt.hash(password, 10);

      // Create agent
      const agent = await User.create({
        name,
        email,
        password: hashedPassword,
        role: 'agent',
        store_id: store_id || null,
      });

      res.status(201).json(agent);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },

  // Update agent
  updateAgent: async (req, res) => {
    try {
      const { id } = req.params;
      const { store_id, name, email, password } = req.body;

      const agent = await User.findByPk(id);

      if (!agent) return res.status(404).json({ message: 'Agent not found' });

      agent.name = name ?? agent.name;
      agent.email = email ?? agent.email;
      agent.store_id = store_id ?? agent.store_id;

      if (password) {
        agent.password = password; //await bcrypt.hash(password, 10);
      }

      await agent.save();

      res.json(agent);
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: 'Server error' });
    }
  },
};
