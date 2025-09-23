const express = require('express');
const router = express.Router();
const AgentController = require('../controllers/AgentController');
const auth = require("../middleware/authMiddleware");

// get all agents
router.get('/',auth,AgentController.getAgents);

// add new agent
router.post('/',auth,AgentController.addAgent);

// update agent
router.put('/:id',auth,AgentController.updateAgent);

module.exports = router;