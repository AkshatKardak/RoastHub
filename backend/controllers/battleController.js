import { groq, GROQ_MODEL } from '../config/groq.js';
import battlePrompt from '../prompts/battlePrompt.js';

export const roastBattle = async (req, res, next) => {
  try {
    const { topicA, topicB } = req.body;
    if (!topicA?.trim() || !topicB?.trim())
      return res.status(400).json({ error: 'Both topics are required.' });
    if (topicA.trim().toLowerCase() === topicB.trim().toLowerCase())
      return res.status(400).json({ error: 'Topics must be different.' });

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: battlePrompt(topicA.trim(), topicB.trim()) }],
      temperature: 0.95,
      max_tokens: 2500,
    });

    const raw = completion.choices[0]?.message?.content || '';
    let parsed;
    try {
      parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
    } catch {
      return res.status(500).json({ error: 'AI battle failed. Try again.' });
    }
    res.json(parsed);
  } catch (err) {
    next(err);
  }
};