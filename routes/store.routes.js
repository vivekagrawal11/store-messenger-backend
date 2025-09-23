const express = require("express");
const router = express.Router();
const storeController = require("../controllers/storeController");
const auth = require("../middleware/authMiddleware");

router.post("/", storeController.createStore,auth);
router.get("/", storeController.getStores,auth);
router.get("/:id", storeController.getStoreById,auth);
router.put("/:id", storeController.updateStore,auth);
router.delete("/:id", storeController.deleteStore,auth);

module.exports = router;