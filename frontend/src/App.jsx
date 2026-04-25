import React, { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import "./App.css";

import TweetCard         from "./components/TweetCard";
import SkeletonGrid      from "./components/SkeletonGrid";
import EmptyState        from "./components/EmptyState";
import SearchWithHistory from "./components/SearchWithHistory";
import TrendingTopics    from "./components/TrendingTopics";
import RandomRoulette    from "./components/RandomRoulette";
import PinnedFeed        from "./components/PinnedFeed";
import WallOfFame        from "./components/WallOfFame";
import RoastBattleMode   from "./components/RoastBattleMode";
import usePinnedTweets   from "./hooks/usePinnedTweets";

export const API_BASE =
  import.meta.env.VITE_API_BASE_URL || "https://roasthub-backend-api.onrender.com";

const TABS = [
  { id: "generate", label: "🔥 Generate"     },
  { id: "battle",   label: "⚔️ Battle"       },
  { id: "fame",     label: "🏆 Hall of Fame" },
];

/* ── Inline SVG flame logo (matches favicon style) ── */
function FlameLogo({ size = 64 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="RoastHub flame logo"
      className="logo-svg"
    >
      <defs>
        <radialGradient id="flame-outer" cx="50%" cy="80%" r="60%">
          <stop offset="0%"   stopColor="#ff6b35" />
          <stop offset="60%"  stopColor="#ff4520" />
          <stop offset="100%" stopColor="#c0290a" />
        </radialGradient>
        <radialGradient id="flame-inner" cx="50%" cy="85%" r="50%">
          <stop offset="0%"   stopColor="#ffe066" />
          <stop offset="50%"  stopColor="#ffaa00" />
          <stop offset="100%" stopColor="#ff6b35" />
        </radialGradient>
        <filter id="flame-glow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      {/* Outer flame body */}
      <path
        d="M32 4
           C32 4 44 18 44 28
           C44 22 40 18 38 16
           C42 26 46 34 42 44
           C46 38 48 30 46 22
           C50 32 50 44 44 52
           C48 46 50 36 46 30
           C50 40 50 52 44 58
           C40 62 24 62 20 58
           C14 52 14 40 18 30
           C14 36 16 46 20 52
           C14 44 14 32 18 22
           C16 30 18 38 22 44
           C18 34 22 26 26 16
           C24 18 20 22 20 28
           C20 18 32 4 32 4Z"
        fill="url(#flame-outer)"
        filter="url(#flame-glow)"
      />

      {/* Inner bright core */}
      <path
        d="M32 22
           C32 22 38 30 38 38
           C38 34 35 30 34 28
           C36 33 38 38 36 44
           C38 40 38 34 36 28
           C38 34 38 42 34 48
           C32 52 30 52 28 48
           C24 42 24 34 26 28
           C24 34 24 40 26 44
           C24 38 26 33 28 28
           C27 30 24 34 24 38
           C24 30 32 22 32 22Z"
        fill="url(#flame-inner)"
        opacity="0.9"
      />
    </svg>
  );
}

export default function App() {
  const [topic,   setTopic]   = useState("");
  const [tweets,  setTweets]  = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [tab,     setTab]     = useState("generate");
  const [count,   setCount]   = useState(6);

  const { isPinned, toggle: togglePin } = usePinnedTweets();

  /* generateTweets also accepts a topic directly (from roulette / chips) */
  const generateTweets = useCallback(async (customTopic) => {
    const t = (customTopic ?? topic).trim();
    if (!t) { setError("Please enter a topic."); return; }

    setLoading(true);
    setError("");
    setTweets([]);

    try {
      const res = await axios.post(`${API_BASE}/api/tweets/generate`, {
        topic: t,
        count,
      });
      setTweets(res.data.tweets || []);
      if (customTopic) setTopic(customTopic);
    } catch (err) {
      setError(
        err.response?.data?.error || "Something went wrong. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [topic, count]);

  const handleChipClick = (chipTopic) => {
    setTopic(chipTopic);
    generateTweets(chipTopic);
  };

  return (
    <div className="app">

      {/* ── HERO HEADER ── */}
      <header className="app-header">
        <div className="logo-wrap">
          <FlameLogo size={72} />
          <h1 className="app-title">Roast<span>Hub</span></h1>
          <p className="app-subtitle">Global AI Roast Generator</p>
        </div>
      </header>

      <main className="app-main">

        {/* ── TABS ── */}
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
            <PinnedFeed />

            <div className="search-controls">
              {/* Single unified search row */}
              <div className="search-row">
                {/* SearchWithHistory owns the text input + its own submit btn */}
                <SearchWithHistory
                  onSearch={generateTweets}
                  loading={loading}
                  topic={topic}
                  setTopic={setTopic}
                />

                {/* Count selector — only this stays beside the search */}
                <div className="count-select-wrap">
                  <label className="count-label">Count</label>
                  <select
                    className="count-select"
                    value={count}
                    onChange={(e) => setCount(Number(e.target.value))}
                    disabled={loading}
                  >
                    {[3, 4, 5, 6, 7, 8, 10].map((n) => (
                      <option key={n} value={n}>{n} roasts</option>
                    ))}
                  </select>
                </div>
                {/* ✅ Removed the redundant outer "Roast It" generate-btn —
                    SearchWithHistory already submits on its own button */}
              </div>

              {/* Trending + Roulette */}
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

            {/* Skeleton while loading */}
            {loading && <SkeletonGrid count={count} />}

            {/* Empty state */}
            {!loading && tweets.length === 0 && !error && (
              <EmptyState onTopicClick={handleChipClick} />
            )}

            {/* Results grid */}
            {!loading && tweets.length > 0 && (
              <motion.div
                className="tweets-grid"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35 }}
              >
                <AnimatePresence>
                  {tweets.map((tweet, i) => (
                    <motion.div
                      key={`${tweet.text}-${i}`}
                      initial={{ opacity: 0, y: 16 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: i * 0.06 }}
                    >
                      <TweetCard
                        tweet={tweet}
                        index={i}
                        isPinned={isPinned(tweet)}
                        onPin={() => togglePin(tweet)}
                      />
                    </motion.div>
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
        🔥 RoastHub · AI-Powered Global Roast Generator · Built with Groq + MongoDB
      </footer>
    </div>
  );
}