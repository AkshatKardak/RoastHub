const Groq = require("groq-sdk");
const Tweet = require("../models/Tweet");
const generatePrompt = require("../prompts/generatePrompt");

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const generateTweets = async (req, res, next) => {
  try {
    const { topic, count = 6 } = req.body;
    const safeCount = Math.min(Math.max(parseInt(count) || 6, 3), 10);

    // Check if topic was recently generated (within 5 min) — return cached
    const fiveMinAgo = new Date(Date.now() - 5 * 60 * 1000);
    const cached = await Tweet.findOne({
      topic: { $regex: new RegExp(`^${topic}$`, "i") },
      generatedAt: { $gte: fiveMinAgo },
    }).sort({ generatedAt: -1 });

    if (cached) {
      // Increment search count for trending
      await Tweet.updateOne({ _id: cached._id }, { $inc: { searchCount: 1 } });
      return res.json({ topic: cached.topic, tweets: cached.tweets, cached: true });
    }

    // Call Groq
    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192",
      messages: [{ role: "user", content: generatePrompt(topic, safeCount) }],
      temperature: 0.9,
      max_tokens: 3000,
    });

    const raw = completion.choices[0]?.message?.content || "";
    let parsed;
    try {
      // Strip any accidental markdown
      const clean = raw.replace(/```json|```/g, "").trim();
      parsed = JSON.parse(clean);
    } catch {
      return res.status(500).json({ error: "AI returned invalid JSON. Please try again." });
    }

    const tweets = (parsed.tweets || []).slice(0, safeCount);

    // Save to MongoDB
    const doc = await Tweet.create({ topic, tweets, generatedAt: new Date() });

    // Also upsert trending count for this topic
    await Tweet.updateMany(
      { topic: { $regex: new RegExp(`^${topic}$`, "i") } },
      { $inc: { searchCount: 1 } }
    );

    res.json({ topic, tweets: doc.tweets, cached: false });
  } catch (err) {
    next(err);
  }
};

module.exports = { generateTweets };