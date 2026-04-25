import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import https from 'https';

import tweetRoutes     from './routes/tweets.js';
import battleRoutes    from './routes/battle.js';
import translateRoutes from './routes/translate.js';
import trendingRoutes  from './routes/trending.js';
import fameRoutes      from './routes/fame.js';
import errorHandler    from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

async function connectDB() {
  if (!MONGODB_URI) {
    console.error('❌ MONGODB_URI not found in environment variables.');
    process.exit(1);
  }
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
      socketTimeoutMS: 45000,
      family: 4,
    });
    console.log('✅ Connected to MongoDB Atlas');
  } catch (err) {
    console.error('❌ MongoDB connection failed:', err.message);
    process.exit(1);
  }
}

connectDB();

app.use(cors({
  origin: process.env.FRONTEND_URL || 'https://roasthubfront.vercel.app',
  methods: ['GET', 'POST'],
}));
app.use(express.json());

// ── ROUTES ──
app.use('/api/tweets',    tweetRoutes);
app.use('/api/battle',    battleRoutes);
app.use('/api/translate', translateRoutes);
app.use('/api/trending',  trendingRoutes);
app.use('/api/fame',      fameRoutes);

app.get('/', (req, res) => {
  res.json({ message: '🔥 RoastHub backend is live!' });
});

app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    message: 'RoastHub is healthy!',
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString(),
  });
});

// ── ERROR HANDLER (must be last) ──
app.use(errorHandler);

// ── START + KEEP-ALIVE ──
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server running on port ${PORT}`);
  const RENDER_URL = process.env.RENDER_EXTERNAL_URL;
  if (RENDER_URL) {
    setInterval(() => {
      https.get(`${RENDER_URL}/api/health`, (res) => {
        console.log(`🔁 Keep-alive ping → ${res.statusCode}`);
      }).on('error', (err) => {
        console.warn('⚠️ Keep-alive ping failed:', err.message);
      });
    }, 14 * 60 * 1000);
    console.log(`⏰ Keep-alive enabled → ${RENDER_URL}/api/health`);
  }
});

export default app;