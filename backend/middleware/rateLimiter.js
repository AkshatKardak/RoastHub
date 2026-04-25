const rateLimit = require("express-rate-limit");

const generateLimiter = rateLimit({
  windowMs: 60 * 1000,    // 1 minute
  max: 15,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: "Too many requests. Please wait a moment and try again." },
});

const battleLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 8,
  message: { error: "Too many battles! Cool down for a minute." },
});

module.exports = { generateLimiter, battleLimiter };