import { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "https://roasthub-backend-api.onrender.com";

export default function TrendingTopics({ onTopicClick }) {
  const [trending, setTrending] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrending = async () => {
      try {
        const res = await axios.get(`${API_BASE}/api/trending`);
        setTrending(res.data.trending || []);
      } catch (err) {
        console.error("Failed to fetch trending:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTrending();
    const interval = setInterval(fetchTrending, 60000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="trending-sidebar">
        <h3>🔁 Trending Topics</h3>
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="skeleton" style={{ height: "32px", marginBottom: "8px", borderRadius: "8px" }} />
        ))}
      </div>
    );
  }

  return (
    <div className="trending-sidebar">
      <h3>🔁 Trending Topics</h3>
      {trending.length === 0 ? (
        <p className="trending-empty">No trending topics yet. Be the first to roast!</p>
      ) : (
        <ul className="trending-list">
          {trending.map((item, i) => (
            <li key={i} className="trending-item">
              <button
                className="trending-btn"
                onClick={() => onTopicClick(item.topic)}
              >
                <span className="trending-rank">#{i + 1}</span>
                <span className="trending-topic">{item.topic}</span>
                <span className="trending-count">{item.count} roasts</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}