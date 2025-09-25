const SiteConfig = require("../models/siteConfig.model");

// create
exports.createConfig = async (req, res) => {
  try {
    const config = await SiteConfig.create(req.body);
    return res.status(201).json({ success: true, data: config });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// get all
exports.getConfigs = async (req, res) => {
  try {
    const configs = await SiteConfig.findAll({
      attributes: ["id", "name", "slug", "value", "config_type", "created_at"]
    });
    res.json(configs);
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
exports.getConfigById = async (req, res) => {
  try {
    const config = await SiteConfig.findByPk(req.params.id);
    if (!config) return res.status(404).json({ success: false, message: "Config not found" });
    return res.status(200).json({ success: true, data: config });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
// update
exports.updateConfig = async (req, res) => {
  try {
    const [updated] = await SiteConfig.update(req.body, {
      where: { id: req.params.id }
    });

    if (!updated) {
      return res.status(404).json({ success: false, message: "Config not found" });
    }

    const updatedConfig = await SiteConfig.findByPk(req.params.id);
    return res.status(200).json({ success: true, data: updatedConfig });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// delete
exports.deleteConfig = async (req, res) => {
  try {
    const deleted = await SiteConfig.destroy({ where: { id: req.params.id } });
    if (!deleted) {
      return res.status(404).json({ success: false, message: "Config not found" });
    }

    return res.status(200).json({ success: true, message: "Config deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
