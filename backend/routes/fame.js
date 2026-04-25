const express = require("express");
const router = express.Router();
const { getWallOfFame } = require("../controllers/fameController");

// GET /api/fame?range=alltime|week|today
router.get("/", getWallOfFame);

module.exports = router;