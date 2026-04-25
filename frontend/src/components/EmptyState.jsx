export default function EmptyState({ onTopicClick }) {
  const TOPIC_SUGGESTIONS = [
    "Cricket fans", "Biryani lovers", "Mumbai traffic", "Delhi winters",
    "Startup founders", "Finance bros", "Instagram reels", "Gym selfies",
    "Taylor Swift", "Elon Musk", "NFT traders", "Python devs",
    "Minecraft kids", "Astrology girlies", "Cat parents", "Chai vs Coffee",
  ];

  return (
    <div className="empty-state">
      <div className="empty-state-icon">🔥</div>
      <h3>Enter a topic to get roasted</h3>
      <p>Try one of these popular topics:</p>
      <div className="topic-chips">
        {TOPIC_SUGGESTIONS.map((topic) => (
          <button
            key={topic}
            className="topic-chip"
            onClick={() => onTopicClick(topic)}
          >
            {topic}
          </button>
        ))}
      </div>
    </div>
  );
}