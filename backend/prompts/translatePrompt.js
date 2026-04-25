const translatePrompt = (text, language) => `
Translate this roast tweet into ${language}.
Keep the savage tone, punchiness, and humor intact.
If a joke doesn't translate directly, adapt it culturally so it still lands.

Original: "${text}"

Return ONLY valid JSON:
{
  "translated": "the translated roast in ${language}",
  "language": "${language}",
  "note": "optional: one sentence if you adapted a joke culturally, else empty string"
}
`;

module.exports = translatePrompt;