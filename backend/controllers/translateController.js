const Groq = require("groq-sdk");
const translatePrompt = require("../prompts/translatePrompt");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const translateRoast = async (req, res, next) => {
  try {
    const { text, language } = req.body;

    if (!text?.trim()) return res.status(400).json({ error: "Text is required." });
    if (!language?.trim()) return res.status(400).json({ error: "Language is required." });

    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: translatePrompt(text.trim(), language.trim()) }],
      temperature: 0.7,
      max_tokens: 800,
    });

    const raw = completion.choices[0]?.message?.content || "";
    let parsed;
    try {
      parsed = JSON.parse(raw.replace(/```json|```/g, "").trim());
    } catch {
      parsed = { translated: raw.trim(), language, note: "" };
    }

    res.json(parsed);
  } catch (err) {
    next(err);
  }
};

module.exports = { translateRoast };