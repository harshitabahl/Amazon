
const router = require("express").Router();

const { chatWithAI } = require("../controllers/chatController");

// POST /api/chat
router.post("/", chatWithAI);

module.exports = router;
