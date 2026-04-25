const express = require("express");
const router = express.Router();
const { getTrending } = require("../controllers/trendingController");

// GET /api/trending
router.get("/", getTrending);

module.exports = router;