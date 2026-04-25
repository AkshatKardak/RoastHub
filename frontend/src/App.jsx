import React, { useState } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import './App.css';

const API_BASE = import.meta.env.VITE_API_BASE_URL || 'https://roasthub-backend-api.onrender.com';

// ── Topic suggestions (global, not season-specific) ──
const TOPIC_SUGGESTIONS = [
  "AI taking over jobs", "Netflix raising prices", "Coffee addicts",
  "Monday mornings", "Social media detox", "Working from home",
  "Student loans", "Gym resolutions", "Dating apps",
  "Crypto investors", "Procrastinators", "Morning people",
  "Elon Musk", "Taylor Swift fans", "Football transfers",
  "Startup culture", "Gen Z vs Millennials", "Online shopping addicts",
  "Climate change deniers", "Influencer culture", "Fast food lovers",
  "Remote workers", "Gamers", "Book clubs",
  "People who don't tip", "LinkedIn hustle culture", "3 AM people",
  "Overconfident beginners", "Overcaffeinated devs", "Gym bros",
];

const RATING_CONFIG = [
  { key: 'viral',        label: 'Viral'        },
  { key: 'relatable',    label: 'Relatable'    },
  { key: 'savage',       label: 'Savage'       },
  { key: 'brutal',       label: 'Brutal'       },
  { key: 'humor',        label: 'Humor'        },
  { key: 'originality',  label: 'Originality'  },
  { key: 'shareability', label: 'Shareable'    },
];

const TONE_EMOJI = {
  sarcastic: '😏',
  dark:      '🖤',
  ironic:    '🔄',
  playful:   '😜',
  deadpan:   '😐',
};

function getRatingColor(value) {
  if (value >= 8) return 'var(--color-rating-high)';
  if (value >= 5) return 'var(--color-rating-mid)';
  return 'var(--color-rating-low)';
}

function getTopBadge(tweet) {
  const avg = (tweet.viral + tweet.relatable + tweet.savage + tweet.brutal +
               (tweet.humor || 5) + (tweet.originality || 5) + (tweet.shareability || 5)) / 7;
  if (avg >= 8) return { label: '🔥 Viral Bomb',  cls: 'high' };
  if (avg >= 6) return { label: '⚡ Spicy',        cls: 'mid'  };
  return            { label: '😐 Mid Energy',    cls: 'low'  };
}

function RatingBars({ tweet }) {
  return (
    <div className="ratings-container">
      {RATING_CONFIG.map(({ key, label }) => {
        const val = tweet[key] ?? 0;
        return (
          <div className="rating-row" key={key}>
            <span className="rating-label">{label}</span>
            <div className="rating-track">
              <div
                className="rating-fill"
                style={{
                  width: `${val * 10}%`,
                  background: getRatingColor(val),
                }}
              />
            </div>
            <span className="rating-value">{val}/10</span>
          </div>
        );
      })}
    </div>
  );
}

function TweetCard({ tweet, index }) {
  const [copied, setCopied] = useState(false);
  const badge = getTopBadge(tweet);
  const toneEmoji = TONE_EMOJI[tweet.tone] || '😏';

  const handleCopy = () => {
    const textToCopy = tweet.hashtags?.length
      ? `${tweet.text}\n\n${tweet.hashtags.join(' ')}`
      : tweet.text;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <motion.div
      className="tweet-card"
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        delay: index * 0.07,
        duration: 0.45,
        ease: [0.16, 1, 0.3, 1],
      }}
    >
      <span className="tweet-card-index">#{String(index + 1).padStart(2, '0')}</span>

      <p className="tweet-text">{tweet.text}</p>

      <RatingBars tweet={tweet} />

      <div className="reason">
        <strong>Why it works: </strong>{tweet.reason}
      </div>

      {/* Hashtags */}
      {tweet.hashtags && tweet.hashtags.length > 0 && (
        <div className="hashtags-row">
          {tweet.hashtags.map((tag, i) => (
            <span key={i} className="hashtag-pill">{tag}</span>
          ))}
        </div>
      )}

      <div className="card-footer">
        <div className="tweet-badges">
          <span className={`badge ${badge.cls}`}>{badge.label}</span>
          {tweet.tone && (
            <span className="badge tone-badge">
              {toneEmoji} {tweet.tone}
            </span>
          )}
        </div>
        <button
          className={`copy-btn ${copied ? 'copied' : ''}`}
          onClick={handleCopy}
          aria-label="Copy tweet text"
        >
          {copied ? '✓ Copied!' : 'Copy'}
        </button>
      </div>
    </motion.div>
  );
}

function SkeletonGrid() {
  return (
    <div className="tweets-grid" style={{ marginTop: '1rem' }}>
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="skeleton-card" style={{ animationDelay: `${i * 0.1}s` }} />
      ))}
    </div>
  );
}

function TopicChips({ onSelect }) {
  return (
    <div className="topic-chips-wrap">
      <p className="chips-label">🌍 Try a topic:</p>
      <div className="topic-chips">
        {TOPIC_SUGGESTIONS.map((t) => (
          <button key={t} className="topic-chip" onClick={() => onSelect(t)}>
            {t}
          </button>
        ))}
      </div>
    </div>
  );
}

function EmptyState({ onSelect }) {
  return (
    <motion.div
      className="placeholder"
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3, duration: 0.5 }}
    >
      <div className="placeholder-icon">🔥</div>
      <h3>No roasts yet</h3>
      <p>
        Type any topic above or pick one below and hit{' '}
        <strong>Generate Roasts</strong> for savage global-style tweets.
      </p>
      <TopicChips onSelect={onSelect} />
    </motion.div>
  );
}

export default function App() {
  const [topic, setTopic]     = useState('');
  const [tweets, setTweets]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState('');
  const [theme, setTheme]     = useState(
    () => document.documentElement.getAttribute('data-theme') || 'dark'
  );

  const toggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    try { localStorage.setItem('roasthub-theme', next); } catch (e) {}
  };

  const generateTweets = async (overrideTopic) => {
    const finalTopic = (overrideTopic || topic).trim();
    if (!finalTopic) { setError('Please enter a topic first!'); return; }
    if (overrideTopic) setTopic(overrideTopic);
    setLoading(true);
    setError('');
    setTweets([]);
    try {
      const res = await axios.post(`${API_BASE}/api/tweets/generate`, {
        topic: finalTopic,
      });
      setTweets(res.data.tweets);
    } catch (err) {
      console.error(err);
      setError('Failed to generate tweets. Check your connection and try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleKey = (e) => {
    if (e.key === 'Enter' && !loading) generateTweets();
  };

  return (
    <div className="app">
      {/* Theme Toggle */}
      <button
        className="theme-toggle"
        onClick={toggleTheme}
        aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
      >
        {theme === 'dark' ? '☀️' : '🌑'}
      </button>

      <motion.div
        className="container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Header */}
        <header className="header">
          <motion.h1
            className="title"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.7, type: 'spring', bounce: 0.35 }}
          >
            RoastHub
          </motion.h1>
          <p className="subtitle">Your Global Savage Tweet Generator</p>
        </header>

        {/* Input */}
        <div className="input-section">
          <motion.input
            type="text"
            placeholder="Enter any topic… (Sports, AI, Relationships, Life)"
            value={topic}
            onChange={(e) => { setTopic(e.target.value); setError(''); }}
            onKeyDown={handleKey}
            className="topic-input"
            whileFocus={{ scale: 1.01 }}
            disabled={loading}
            maxLength={100}
          />
          <motion.button
            onClick={() => generateTweets()}
            disabled={loading}
            className="generate-btn"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {loading ? '⏳ Generating…' : '🔥 Generate Roasts'}
          </motion.button>
        </div>

        {/* Error */}
        <AnimatePresence>
          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25 }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Skeleton */}
        {loading && <SkeletonGrid />}

        {/* Tweets */}
        {!loading && tweets.length > 0 && (
          <motion.div
            className="tweets-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h2 className="tweets-title">
              Roasting <span>"{topic}"</span>
            </h2>
            <div className="tweets-grid">
              {tweets.map((tweet, i) => (
                <TweetCard key={i} tweet={tweet} index={i} />
              ))}
            </div>
          </motion.div>
        )}

        {/* Empty State */}
        {!loading && tweets.length === 0 && !error && (
          <EmptyState onSelect={(t) => generateTweets(t)} />
        )}
      </motion.div>
    </div>
  );
}