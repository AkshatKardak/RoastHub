import Tweet from '../models/Tweet.js';
import OpenAI from 'openai';
import dotenv from 'dotenv';
import { connectDB } from '../server.js';

dotenv.config();

// Initialize Grok AI (using OpenAI SDK with Grok endpoint)
let grokClient;
try {
  grokClient = new OpenAI({
    apiKey: process.env.GROK_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });
  console.log('✅ Grok AI initialized successfully');
} catch (error) {
  console.log('❌ Grok AI initialization failed, using mock mode');
}

export const generateTweets = async (req, res) => {
  try {
    const { topic } = req.body;

    console.log('📝 Received topic:', topic);

        // Ensure MongoDB connection for serverless
    await connectDB();

    if (!topic || topic.trim() === '') {
      return res.status(400).json({ 
        error: 'Topic is required',
        message: 'Please provide a trending topic to generate tweets about'
      });
    }

    const tweets = await generateAITweets(topic.trim());

    // Save to database
    const savedTweet = new Tweet({
      topic: topic.trim(),
      tweets,
      generatedAt: new Date()
    });

    await savedTweet.save();
    console.log('✅ Tweets saved to database');

    res.json({ 
      success: true,
      topic: topic.trim(),
      tweets 
    });

  } catch (error) {
    console.error('❌ Error generating tweets:', error);
    res.status(500).json({ 
      error: 'Internal server error',
      message: 'Failed to generate tweets. Please try again.'
    });
  }
};

async function generateAITweets(topic) {
  // If Grok AI is not configured, use mock tweets
  if (!grokClient || !process.env.GROK_API_KEY) {
    console.log('🔄 Using mock tweets (Grok AI not configured)');
    return generateMockTweets(topic);
  }

  try {
    console.log('🤖 Generating AI tweets with Grok for topic:', topic);

    const prompt = `
    You are RoastHub, an AI specialized in creating savage, brutal, no-hesitation, ultra-relatable tweets for Indian audiences.
    
    Generate exactly 10 viral-potential tweets on this topic: "${topic}"
    
    Requirements:
    - Each tweet must be 1-2 lines maximum
    - Use Hinglish, Gen-Z slang, or trending Indian phrases
    - Reference Bollywood, cricket, or current Indian pop culture
    - Be savage and brutal but avoid hate speech
    - Each tweet should be different in format and style
    - Use current Indian internet slang (rizz, slay, no cap, vibe, lit, etc.)
    - Include references to recent Bollywood movies, cricket matches, or viral Indian trends
    
    For each tweet, provide these ratings out of 10:
    - Viral Potential: How likely to go viral on Indian Twitter/X
    - Relatability: How much Indians will connect with it  
    - Savage Level: How brutally honest/roasting it is
    - Brutal Factor: How hard-hitting the truth is
    
    Return ONLY a JSON array where each object has:
    {
      "text": "the actual tweet text",
      "viral": number,
      "relatable": number, 
      "savage": number,
      "brutal": number,
      "reason": "one sentence explaining the ratings"
    }
    
    Generate exactly 10 tweets about "${topic}".
    `;

    const completion = await grokClient.chat.completions.create({
      model: "llama-3.1-70b-versatile",
