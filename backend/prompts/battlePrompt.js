const battlePrompt = (topicA, topicB) => `
You are RoastHub Battle Arena — judge a savage roast battle between two topics.

Topic A: "${topicA}"
Topic B: "${topicB}"

Generate 3 roast tweets FOR each topic (roasting the OTHER side), then pick a winner.

Return ONLY valid JSON:
{
  "topicA": "${topicA}",
  "topicB": "${topicB}",
  "tweetsA": [
    { "text": "roast tweet about ${topicB}", "roastScore": 0-100, "tone": "string", "badge": "string", "category": "savage|funny|insightful|constructive|supportive" },
    { "text": "...", "roastScore": 0-100, "tone": "string", "badge": "string", "category": "string" },
    { "text": "...", "roastScore": 0-100, "tone": "string", "badge": "string", "category": "string" }
  ],
  "tweetsB": [
    { "text": "roast tweet about ${topicA}", "roastScore": 0-100, "tone": "string", "badge": "string", "category": "string" },
    { "text": "...", "roastScore": 0-100, "tone": "string", "badge": "string", "category": "string" },
    { "text": "...", "roastScore": 0-100, "tone": "string", "badge": "string", "category": "string" }
  ],
  "winner": "A or B",
  "winReason": "one punchy sentence explaining who won and why"
}
`;

module.exports = battlePrompt;