import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import axios from 'axios';
import TweetCard from './TweetCard';
import { API_BASE } from '../App';

const RANGES = [
  { id: 'alltime', label: 'All Time' },
  { id: 'week',    label: 'This Week' },
  { id: 'today',   label: 'Today'     },
];

export default function WallOfFame() {
  const [range,   setRange]   = useState('alltime');
  const [tweets,  setTweets]  = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    axios.get(`${API_BASE}/api/fame?range=${range}`)
      .then(r => setTweets(r.data.tweets || []))
      .catch(() => setTweets([]))
      .finally(() => setLoading(false));
  }, [range]);

  return (
    <div className="fame-container">
      <h2 className="section-title">🏆 Hall of Fame</h2>
      <p className="section-sub">Top-scoring roasts by Roast Score.</p>

      <div className="range-tabs">
        {RANGES.map(r => (
          <button
            key={r.id}
            className={`range-tab${range === r.id ? ' active' : ''}`}
            onClick={() => setRange(r.id)}
          >
            {r.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="tweets-grid" style={{ marginTop: '1rem' }}>
          {Array.from({length: 6}).map((_, i) => (
            <div key={i} className="skeleton-card" style={{ animationDelay: `${i*0.1}s` }} />
          ))}
        </div>
      ) : tweets.length === 0 ? (
        <div className="placeholder">
          <div className="placeholder-icon">🏆</div>
          <h3>No roasts yet</h3>
          <p>Generate some roasts to fill the Hall of Fame!</p>
        </div>
      ) : (
        <motion.div
          className="tweets-grid"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.4 }}
        >
          {tweets.map((tweet, i) => (
            <div key={i} className="fame-card-wrap">
              <span className="fame-rank">#{i + 1}</span>
              <TweetCard tweet={tweet} index={i} compact />
              {tweet.topic && (
                <span className="fame-topic-tag">🗂 {tweet.topic}</span>
              )}
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
}