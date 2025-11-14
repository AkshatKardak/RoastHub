import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import tweetRoutes from './routes/tweets.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tweets', tweetRoutes);

// MongoDB Atlas connection with serverless optimization
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://kardakakshat_db_user:94a6ozyGVdBv8OWP@cluster0roasthub.arxjo5a.mongodb.net/roasthub?retryWrites=true&w=majority&appName=Cluster0RoastHub';

let isConnected = false;

export async function connectDB() {
  if (isConnected) {
    console.log('✅ Using existing MongoDB connection');
    return;
  }
  
  try {
    await mongoose.connect(MONGODB_URI, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferCommands: false,
      maxPoolSize: 10,
      minPoolSize: 1
    });
    
    isConnected = mongoose.connection.readyState === 1;
    console.log('✅ Connected to MongoDB Atlas successfully');
    console.log('📊 Database: roasthub');
  } catch (error) {
    console.error('❌ MongoDB connection error:', error.message);
    throw error;
  }
}

// Initialize connection
connectDB().catch(console.error);

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

// Bind explicitly to 0.0.0.0 so the server is reachable on localhost/IPv4
// Print PID for easier debugging and explicitly bind to 0.0.0.0 so localhost
// and other interfaces can reach the server in dev environments.
console.log('Process PID:', process.pid);
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 RoastHub Server running on port ${PORT}`);
  console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
  console.log('Bound to:', '0.0.0.0');
});

// Export app for Vercel serverless
export default app;
