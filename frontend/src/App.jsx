import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import "./App.css";

// Components
import TweetCard         from "./components/TweetCard";
import SkeletonGrid      from "./components/SkeletonGrid";
import EmptyState        from "./components/EmptyState";
import SearchWithHistory from "./components/SearchWithHistory";
import TrendingTopics    from "./components/TrendingTopics";
import RandomRoulette    from "./components/RandomRoulette";
import PinnedFeed        from "./components/PinnedFeed";
import WallOfFame        from "./components/WallOfFame";
import RoastBattleMode   from "./components/RoastBattleMode";

// Hooks
import { useSearchHistory } from "./hooks/useSearchHistory";

export const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const TABS = [
  { id: "generate", label: "🔥 Generate" },
  { id: "battle",   label: "⚔️ Battle"   },
  { id: "fame",     label: "🏆 Hall of Fame" },
];

export default function App() {
  const [topic,    setTopic]    = useState("");
  const [tweets,   setTweets]   = useState([]);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState("");
  const [tab,      setTab]      = useState("generate");
  const [count,    setCount]    = useState(6);

  const { addToHistory } = useSearchHistory();

  const generateTweets = useCallback(async (customTopic) => {
    const t = (customTopic ?? topic).trim();
    if (!t) { setError("Please enter a topic."); return; }

    setLoading(true); setError(""); setTweets([]);
    addToHistory(t);

    try {
      const res = await axios.post(`${API_BASE}/api/tweets/generate`, {
        topic: t, count,
      });
      setTweets(res.data.tweets || []);
      if (customTopic) setTopic(customTopic);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [topic, count, addToHistory]);

  const handleChipClick = (chipTopic) => {
    setTopic(chipTopic);
    generateTweets(chipTopic);
  };

  return (
    <div className="app">
      {/* Header */}
      <header className="app-header">
        <div className="header-content">
          <div className="logo-wrap">
            <span className="logo-icon">🔥</span>
            <div>
              <h1 className="app-title">RoastHub</h1>
              <p className="app-subtitle">Global AI Roast Generator</p>
            </div>
          </div>
        </div>
      </header>

      <main className="app-main">
        {/* Tabs */}
        <div className="tabs-row">
          {TABS.map((t) => (
            <button
              key={t.id}
              className={`tab-btn${tab === t.id ? " active" : ""}`}
              onClick={() => setTab(t.id)}
            >
              {t.label}
            </button>
          ))}
        </div>

        {/* ── GENERATE TAB ── */}
        {tab === "generate" && (
          <>
            {/* Pinned roasts */}
            <PinnedFeed />

            {/* Search + controls */}
            <div className="search-controls">
              <div className="search-row">
                <SearchWithHistory
                  value={topic}
                  onChange={setTopic}
                  onSubmit={generateTweets}
                  loading={loading}
                />
                <div className="count-select-wrap">
                  abel className="count-label">Count</label>
                  <select
                    className="count-select"
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    disabled={loading}
                  >
                    {[3,4,5,6,7,8,10].map((n) => (
                      <option key={n} value={n}>{n} roasts</option>
                    ))}
                  </select>
                </div>
                <motion.button
                  className="generate-btn"
                  onClick={() => generateTweets()}
                  disabled={loading || !topic.trim()}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {loading ? "🔥 Roasting…" : "🔥 Roast It"}
                </motion.button>
              </div>

              {/* Tools row */}
              <div className="tools-row">
                <TrendingTopics onTopicClick={handleChipClick} />
                <RandomRoulette onSpin={handleChipClick} />
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                className="error-message"
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                ⚠️ {error}
              </motion.div>
            )}

            {/* Results */}
            {loading && <SkeletonGrid count={count} />}

            {!loading && tweets.length === 0 && !error && (
              <EmptyState onChipClick={handleChipClick} />
            )}

            {!loading && tweets.length > 0 && (
              <motion.div
                className="tweets-grid"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.4 }}
              >
                <AnimatePresence>
                  {tweets.map((tweet, i) => (
                    <TweetCard key={`${tweet.text}-${i}`} tweet={tweet} index={i} />
                  ))}
                </AnimatePresence>
              </motion.div>
            )}
          </>
        )}

        {/* ── BATTLE TAB ── */}
        {tab === "battle" && <RoastBattleMode />}

        {/* ── HALL OF FAME TAB ── */}
        {tab === "fame" && <WallOfFame />}
      </main>

      <footer className="app-footer">
        <p>🔥 RoastHub · AI-Powered Global Roast Generator · Built with Groq + MongoDB</p>
      </footer>
    </div>
  );
}