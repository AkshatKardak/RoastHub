import { groq, GROQ_MODEL } from '../config/groq.js';
import translatePrompt from '../prompts/translatePrompt.js';

export const translateRoast = async (req, res, next) => {
  try {
    const { text, language } = req.body;
    if (!text?.trim()) return res.status(400).json({ error: 'Text is required.' });
    if (!language?.trim()) return res.status(400).json({ error: 'Language is required.' });

    const completion = await groq.chat.completions.create({
      model: GROQ_MODEL,
      messages: [{ role: 'user', content: translatePrompt(text.trim(), language.trim()) }],
      temperature: 0.7,
      max_tokens: 800,
    });

    const raw = completion.choices[0]?.message?.content || '';
    let parsed;
    try {
      parsed = JSON.parse(raw.replace(/```json|```/g, '').trim());
    } catch {
      parsed = { translated: raw.trim(), language, note: '' };
    }
    res.json(parsed);
  } catch (err) {
    next(err);
  }
};