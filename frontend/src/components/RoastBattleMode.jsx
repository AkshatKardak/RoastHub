import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import TweetCard from './TweetCard';
import { API_BASE } from '../App';

export default function RoastBattleMode() {
  const [topicA, setTopicA] = useState('');
  const [topicB, setTopicB] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');

  const startBattle = async () => {
    if (!topicA.trim() || !topicB.trim()) {
      setError('Enter both topics to battle!'); return;
    }
    setLoading(true); setError(''); setResult(null);
    try {
      const res = await axios.post(`${API_BASE}/api/battle`, {
        topicA: topicA.trim(), topicB: topicB.trim(),
      });
      setResult(res.data);
    } catch (err) {
      setError('Battle failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="battle-container">
      <h2 className="section-title">⚔️ Roast Battle Mode</h2>
      <p className="section-sub">Two topics. One winner. Pure savagery.</p>

      <div className="battle-inputs">
        <input
          className="topic-input battle-input"
          placeholder="Topic A  (e.g. Gym Bros)"
          value={topicA}
          onChange={e => setTopicA(e.target.value)}
          maxLength={100}
        />
        <span className="vs-badge">VS</span>
        <input
          className="topic-input battle-input"
          placeholder="Topic B  (e.g. Couch Potatoes)"
          value={topicB}
          onChange={e => setTopicB(e.target.value)}
          maxLength={100}
        />
      </div>

      <motion.button
        className="generate-btn battle-btn"
        onClick={startBattle}
        disabled={loading}
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
      >
        {loading ? '⚔️ Battling…' : '⚔️ Start Battle'}
      </motion.button>

      {error && <p className="error-message">{error}</p>}

      {loading && (
        <div className="battle-skeleton">
          {Array.from({length: 4}).map((_, i) => (
            <div key={i} className="skeleton-card" style={{ animationDelay: `${i*0.1}s` }} />
          ))}
        </div>
      )}

      <AnimatePresence>
        {result && !loading && (
          <motion.div
            className="battle-results"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* Winner Banner */}
            <div className={`winner-banner winner-${result.winner}`}>
              🏆 Winner: <strong>{result.winner === 'A' ? result.topicA : result.topicB}</strong>
              <p className="win-reason">{result.winReason}</p>
            </div>

            <div className="battle-cols">
              {/* Side A */}
              <div className="battle-col">
                <h3 className="battle-col-title side-a">{result.topicA}</h3>
                {result.tweetsA.map((t, i) => (
                  <TweetCard key={i} tweet={t} index={i} compact />
                ))}
              </div>

              {/* Side B */}
              <div className="battle-col">
                <h3 className="battle-col-title side-b">{result.topicB}</h3>
                {result.tweetsB.map((t, i) => (
                  <TweetCard key={i} tweet={t} index={i} compact />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}