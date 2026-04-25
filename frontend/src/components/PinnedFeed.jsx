import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import TweetCard from './TweetCard';

const PINNED_KEY = 'roasthub-pinned';

export default function PinnedFeed() {
  const [pinned, setPinned] = useState([]);
  const [open,   setOpen]   = useState(false);

  useEffect(() => {
    const refresh = () => {
      try { setPinned(JSON.parse(localStorage.getItem(PINNED_KEY) || '[]')); } catch {}
    };
    refresh();
    window.addEventListener('storage', refresh);
    return () => window.removeEventListener('storage', refresh);
  }, []);

  if (pinned.length === 0) return null;

  return (
    <div className="pinned-feed">
      <button className="pinned-toggle" onClick={() => setOpen(o => !o)}>
        📌 Pinned Roasts ({pinned.length}) {open ? '▲' : '▼'}
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            className="tweets-grid"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.35 }}
          >
            {pinned.map((tweet, i) => (
              <TweetCard key={i} tweet={tweet} index={i} compact />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}