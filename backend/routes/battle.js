const express = require("express");
const router = express.Router();
const { roastBattle } = require("../controllers/battleController");
const { battleLimiter } = require("../middleware/rateLimiter");

// POST /api/battle
router.post("/", battleLimiter, roastBattle);

module.exports = router;