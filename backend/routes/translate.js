const express = require("express");
const router = express.Router();
const { translateRoast } = require("../controllers/translateController");

// POST /api/translate
router.post("/", translateRoast);

module.exports = router;