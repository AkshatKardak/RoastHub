export function getTopBadge(tweet) {
  const scores = [
    tweet.viral,
    tweet.relatable,
    tweet.savage,
    tweet.brutal,
    tweet.humor,
    tweet.originality,
    tweet.shareability,
  ];
  const max = Math.max(...scores.filter(Boolean));

  if (max >= 90) return { label: "🏆 Viral Bomb", color: "#ff6b35" };
  if (max >= 80) return { label: "⚡ Savage Hit", color: "#e74c3c" };
  if (max >= 70) return { label: "🎯 Relatable AF", color: "#9b59b6" };
  if (max >= 60) return { label: "😂 Good Roast", color: "#27ae60" };
  return { label: "💬 Solid Roast", color: "#3498db" };
}