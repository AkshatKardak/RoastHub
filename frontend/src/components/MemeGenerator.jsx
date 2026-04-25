import React, { useRef, useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const BG_COLORS = ['#1a1a2e','#16213e','#0f3460','#533483','#2b2d42','#1b1b2f'];

export default function MemeGenerator({ text, onClose }) {
  const canvasRef  = useRef(null);
  const [bgColor,  setBgColor]  = useState(BG_COLORS[0]);
  const [fontSize, setFontSize] = useState(28);
  const [downloaded, setDownloaded] = useState(false);

  const draw = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    canvas.width  = 600;
    canvas.height = 340;

    // Background
    ctx.fillStyle = bgColor;
    ctx.fillRect(0, 0, 600, 340);

    // Subtle grid overlay
    ctx.strokeStyle = 'rgba(255,255,255,0.04)';
    ctx.lineWidth = 1;
    for (let x = 0; x < 600; x += 30) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,340); ctx.stroke(); }
    for (let y = 0; y < 340; y += 30) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(600,y); ctx.stroke(); }

    // Accent bar top
    const grad = ctx.createLinearGradient(0,0,600,0);
    grad.addColorStop(0, '#ff4520'); grad.addColorStop(1, '#ff8c00');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 600, 6);

    // RoastHub watermark
    ctx.fillStyle = 'rgba(255,69,32,0.55)';
    ctx.font = 'bold 13px Inter, sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('🔥 RoastHub', 588, 326);

    // Tweet text (word-wrapped)
    ctx.fillStyle = '#ffffff';
    ctx.font = `bold ${fontSize}px Inter, sans-serif`;
    ctx.textAlign = 'center';
    const maxW = 520, lineH = fontSize * 1.45;
    const words = text.split(' ');
    let line = '', lines = [];
    for (const word of words) {
      const test = line ? line + ' ' + word : word;
      if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = word; }
      else { line = test; }
    }
    if (line) lines.push(line);
    const totalH = lines.length * lineH;
    const startY = (340 - totalH) / 2 + fontSize * 0.35;
    lines.forEach((l, i) => ctx.fillText(l, 300, startY + i * lineH));
  };

  useEffect(() => { draw(); }, [bgColor, fontSize, text]);

  const handleDownload = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'roasthub-meme.png';
    a.click();
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <AnimatePresence>
      <motion.div
        className="modal-overlay"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="modal-box meme-modal"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ duration: 0.25, ease: [0.16,1,0.3,1] }}
          onClick={e => e.stopPropagation()}
        >
          <div className="modal-header">
            <h3>🖼️ Meme Generator</h3>
            <button className="modal-close" onClick={onClose}>✕</button>
          </div>

          <canvas ref={canvasRef} className="meme-canvas" />

          <div className="meme-controls">
            <div className="meme-control-row">
              <span className="meme-label">Background</span>
              <div className="color-swatches">
                {BG_COLORS.map(c => (
                  <button
                    key={c}
                    className={`color-swatch${bgColor === c ? ' active' : ''}`}
                    style={{ background: c }}
                    onClick={() => setBgColor(c)}
                  />
                ))}
              </div>
            </div>
            <div className="meme-control-row">
              <span className="meme-label">Font size: {fontSize}px</span>
              <input
                type="range" min={18} max={40} value={fontSize}
                onChange={e => setFontSize(Number(e.target.value))}
                className="font-slider"
              />
            </div>
          </div>

          <motion.button
            className="generate-btn"
            onClick={handleDownload}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            {downloaded ? '✅ Downloaded!' : '⬇️ Download Meme'}
          </motion.button>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}