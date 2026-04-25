const validateTopic = (req, res, next) => {
  const { topic } = req.body;
  if (!topic || typeof topic !== "string") {
    return res.status(400).json({ error: "Topic is required." });
  }
  const trimmed = topic.trim();
  if (trimmed.length < 2) {
    return res.status(400).json({ error: "Topic must be at least 2 characters." });
  }
  if (trimmed.length > 150) {
    return res.status(400).json({ error: "Topic must be under 150 characters." });
  }
  // Sanitize
  req.body.topic = trimmed.replace(/[<>]/g, "");
  next();
};

module.exports = validateTopic;