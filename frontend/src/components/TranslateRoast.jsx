import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import axios from 'axios';
import { API_BASE } from '../App';

const LANGUAGES = [
  'Hindi','Spanish','French','German','Portuguese','Japanese',
  'Korean','Arabic','Italian','Russian','Dutch','Turkish',
  'Bengali','Urdu','Marathi','Tamil','Telugu',
];

export default function TranslateRoast({ text, onClose }) {
  const [lang,       setLang]       = useState('Hindi');
  const [result,     setResult]     = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [copied,     setCopied]     = useState(false);

  const handleTranslate = async () => {
    setLoading(true); setResult(null);
    try {
      const res = await axios.post(`${API_BASE}/api/translate`, { text, language: lang });
      setResult(res.data);
    } catch {
      setResult({ translated: `[Translation failed] ${text}`, language: lang });
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!result?.translated) return;
    navigator.clipboard.writeText(result.translated).then(() => {
      setCopied(true); setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-box"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16,1,0.3,1] }}
          onClick={e => e.stopPropagation()}
        >
          <div className="modal-header">
            <h3>🌍 Translate Roast</h3>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>

          <p className="modal-original">"{text}"</p>

          <div className="modal-controls">
            <select
              className="lang-select"
              value={lang}
              onChange={e => setLang(e.target.value)}
            >
              {LANGUAGES.map(l => <option key={l} value={l}>{l}</option>)}
            </select>
            <motion.button
              className="generate-btn"
              onClick={handleTranslate}
              disabled={loading}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
            >
              {loading ? '⏳ Translating…' : 'Translate'}
            </motion.button>
          </div>

          {result && (
            <motion.div
              className="translation-result"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <p className="translated-text">{result.translated}</p>
              {result.note && <p className="translation-note">💡 {result.note}</p>}
              <button className={`copy-btn${copied ? ' copied' : ''}`} onClick={handleCopy}>
                {copied ? '✓ Copied!' : 'Copy Translation'}
              </button>
            </motion.div>
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}