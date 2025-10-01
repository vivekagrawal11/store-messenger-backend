const Store = require("../models/store.model");

exports.createStore = async (req, res) => {
  try {
    const store = await Store.create(req.body);
    return res.status(201).json({ success: true, data: store });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.getStores = async (req, res) => {
  try {
    const stores = await Store.findAll({
      attributes: ["id", "name","city","address","phone_number","no_of_agents"] // only send id and name for dropdown
    });
    res.json(stores);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};

exports.getStoreById = async (req, res) => {
  try {
    const store = await Store.findByPk(req.params.id);
    if (!store) return res.status(404).json({ success: false, message: "Store not found" });
    return res.status(200).json({ success: true, data: store });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateStore = async (req, res) => {
  try {
    const [updated] = await Store.update(req.body, {
      where: { id: req.params.id }
    });

    if (!updated) return res.status(404).json({ success: false, message: "Store not found" });

    const updatedStore = await Store.findByPk(req.params.id);
    return res.status(200).json({ success: true, data: updatedStore });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

exports.deleteStore = async (req, res) => {
  try {
    const deleted = await Store.destroy({ where: { id: req.params.id } });
    if (!deleted) return res.status(404).json({ success: false, message: "Store not found" });

    return res.status(200).json({ success: true, message: "Store deleted successfully" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
