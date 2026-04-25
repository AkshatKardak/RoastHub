const Groq = require("groq-sdk");
const battlePrompt = require("../prompts/battlePrompt");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const roastBattle = async (req, res, next) => {
  try {
    const { topicA, topicB } = req.body;

    if (!topicA?.trim() || !topicB?.trim()) {
      return res.status(400).json({ error: "Both topics are required." });
    }
    if (topicA.trim().toLowerCase() === topicB.trim().toLowerCase()) {
      return res.status(400).json({ error: "Topics must be different." });
    }

    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: battlePrompt(topicA.trim(), topicB.trim()) }],
      temperature: 0.95,
      max_tokens: 2500,
    });

    const raw = completion.choices[0]?.message?.content || "";
    let parsed;
    try {
      parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    } catch {
      return res.status(500).json({ error: "AI battle failed. Try again." });
    }

    res.json(parsed);
  } catch (err) {
    next(err);
  }
};

module.exports = { roastBattle };