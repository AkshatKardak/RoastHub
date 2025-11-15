import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import tweetRoutes from './routes/tweets.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB Atlas connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://kardakakshat_db_user:94a6ozyGVdBv8OWP@cluster0roasthub.arxjo5a.mongodb.net/roasthub?retryWrites=true&w=majority&appName=Cluster0RoastHub';

async function connectDB() {
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ Connected to MongoDB Atlas successfully');
    console.log('📊 Database: roasthub');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
}

// Connect to database
connectDB().catch(console.error);

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tweets', tweetRoutes);

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'RoastHub Backend is running!' });
});

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'RoastHub Backend is healthy!',
    mongodb: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected',
    timestamp: new Date().toISOString()
  });
});

// Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 RoastHub Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log('Process PID:', process.pid);
});

export default app;