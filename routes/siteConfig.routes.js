const express = require("express");
const router = express.Router();
const auth = require("../middleware/authMiddleware");
const siteConfigController = require("../controllers/siteConfig.controller");

router.post("/",auth, siteConfigController.createConfig);
router.get("/",auth, siteConfigController.getConfigs);
router.get("/:id", siteConfigController.getConfigById,auth);
router.put("/:id",auth, siteConfigController.updateConfig);
router.delete("/:id", siteConfigController.deleteConfig);

module.exports = router;
