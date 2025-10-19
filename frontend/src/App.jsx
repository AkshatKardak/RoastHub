import React, { useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import './App.css';

function App() {
  const [topic, setTopic] = useState('');
  const [tweets, setTweets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const generateTweets = async () => {
    if (!topic.trim()) {
      setError('Please enter a topic first!');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const response = await axios.post('http://localhost:5000/api/tweets/generate', {
        topic: topic.trim()
      });
      setTweets(response.data.tweets);
    } catch (error) {
      console.error('Error generating tweets:', error);
      setError('Failed to generate tweets. Please try again.');
    }
    setLoading(false);
  };

  const RatingIcon = ({ type, value }) => {
    const getIcon = () => {
      switch(type) {
        case 'viral': return '🔥';
        case 'relatable': return '💖';
        case 'savage': return '⚡';
        case 'brutal': return '💀';
        default: return '⭐';
      }
    };

    const getColor = () => {
      if (value >= 8) return '#ff4757';
      if (value >= 6) return '#ffa502';
      return '#2ed573';
    };

    return (
      <div className="rating-icon" style={{ color: getColor() }}>
        <span className="icon">{getIcon()}</span>
        <span className="value">{value}/10</span>
      </div>
    );
  };

  return (
    <div className="app">
      {/* Animated Background */}
      <div className="animated-bg">
        <div className="gradient-1"></div>
        <div className="gradient-2"></div>
        <div className="gradient-3"></div>
      </div>

      <motion.div 
        className="container"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <header className="header">
          <motion.h1 
            className="title"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.8, type: "spring" }}
          >
            RoastHub
          </motion.h1>
          <p className="subtitle">Your Savage Tweet Generator</p>
        </header>

        <div className="input-section">
          <motion.input
            type="text"
            placeholder="Enter any trending topic... (e.g., IPL, Bollywood, Politics)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && generateTweets()}
            className="topic-input"
            whileFocus={{ scale: 1.02 }}
            disabled={loading}
          />
          <motion.button
            onClick={generateTweets}
            disabled={loading}
            className="generate-btn"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {loading ? 'Generating Savage Tweets...' : 'Generate Savage Tweets'}
          </motion.button>
        </div>

        {error && (
          <motion.div 
            className="error-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.div>
        )}

        {tweets.length > 0 && (
          <motion.div 
            className="tweets-container"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="tweets-title">Savage Tweets on "{topic}"</h2>
            <div className="tweets-grid">
              {tweets.map((tweet, index) => (
                <motion.div
                  key={index}
                  className="tweet-card"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <p className="tweet-text">"{tweet.text}"</p>
                  
                  <div className="ratings-container">
                    <RatingIcon type="viral" value={tweet.viral} />
                    <RatingIcon type="relatable" value={tweet.relatable} />
                    <RatingIcon type="savage" value={tweet.savage} />
                    <RatingIcon type="brutal" value={tweet.brutal} />
                  </div>

                  <div className="reason">
                    <strong>Why it works:</strong> {tweet.reason}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {tweets.length === 0 && !loading && (
          <motion.div 
            className="placeholder"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <p>💡 Enter a trending topic and generate savage Indian-style tweets!</p>
            <p>Examples: "IPL 2024", "Bollywood nepotism", "Indian politics", "College life"</p>
          </motion.div>
        )}
      </motion.div>
    </div>
  );
}

export default App;
