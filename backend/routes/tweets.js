const express = require("express");
const router = express.Router();
const { generateTweets } = require("../controllers/tweetController");
const { generateLimiter } = require("../middleware/rateLimiter");
const validateTopic = require("../middleware/validateTopic");

// POST /api/tweets/generate
router.post("/generate", generateLimiter, validateTopic, generateTweets);

module.exports = router;