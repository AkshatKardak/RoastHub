import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { TOPIC_SUGGESTIONS } from '../config/topics';

export default function RandomRoulette({ onSpin }) {
  const [spinning, setSpinning]   = useState(false);
  const [selected, setSelected]   = useState(null);
  const [rotation, setRotation]   = useState(0);
  const spinCount = useRef(0);

  const handleSpin = () => {
    if (spinning) return;
    setSpinning(true);
    const randomTopic = TOPIC_SUGGESTIONS[Math.floor(Math.random() * TOPIC_SUGGESTIONS.length)];
    const newRot = rotation + 720 + Math.random() * 360;
    spinCount.current += 1;
    setRotation(newRot);
    setTimeout(() => {
      setSelected(randomTopic);
      setSpinning(false);
      onSpin(randomTopic);
    }, 1200);
  };

  return (
    <div className="roulette-box">
      <p className="chips-label">🎲 Random Roulette:</p>
      <div className="roulette-inner">
        <motion.button
          className={`roulette-btn${spinning ? ' spinning' : ''}`}
          onClick={handleSpin}
          disabled={spinning}
          animate={{ rotate: rotation }}
          transition={{ duration: 1.2, ease: [0.33, 1, 0.68, 1] }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
        >
          🎲
        </motion.button>
        {selected && !spinning && (
          <motion.span
            className="roulette-result"
            initial={{ opacity: 0, x: -8 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
          >
            {selected}
          </motion.span>
        )}
      </div>
    </div>
  );
}