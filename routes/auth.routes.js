const express = require("express");
const router = express.Router();
const { register, login } = require("../controllers/authController");
const auth = require("../middleware/authMiddleware");

router.post("/register", register);
router.post("/login", login);

// Protected Route Example
router.get("/conversation/users", auth, (req, res) => {
    res.json({ message: "Welcome!", user: req.user });
});

module.exports = router;
