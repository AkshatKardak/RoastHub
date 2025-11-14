import Tweet from '../models/Tweet.js';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Groq AI (using OpenAI SDK with Groq endpoint)
let groqClient;
try {
  groqClient = new OpenAI({
    apiKey: process.env.GROK_API_KEY || process.env.GROQ_API_KEY,
    baseURL: 'https://api.groq.com/openai/v1',
  });
  console.log('✅ Groq AI initialized successfully');
} catch (error) {
  console.log('❌ Groq AI initialization failed, using mock mode');
  console.error(error);
}

export const generateTweets = async (req, res) => {
  try {
    const { topic } = req.body;

    console.log('📝 Received topic:', topic);

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
      message: 'Failed to generate tweets. Please try again.',
      details: error.message
    });
  }
};

async function generateAITweets(topic) {
  // If Groq AI is not configured, use mock tweets
  if (!groqClient || (!process.env.GROK_API_KEY && !process.env.GROQ_API_KEY)) {
    console.log('🔄 Using mock tweets (Groq AI not configured)');
    return generateMockTweets(topic);
  }

  try {
    console.log('🤖 Generating AI tweets with Groq for topic:', topic);

    const prompt = `You are RoastHub, an AI specialized in creating savage, brutal, no-hesitation, ultra-relatable tweets for Indian audiences.

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

Return ONLY a valid JSON object with a "tweets" array where each object has:
{
  "tweets": [
    {
      "text": "the actual tweet text",
      "viral": number,
      "relatable": number, 
      "savage": number,
      "brutal": number,
      "reason": "one sentence explaining the ratings"
    }
  ]
}

Generate exactly 10 tweets about "${topic}". Return ONLY the JSON object, no other text.`;

    const completion = await groqClient.chat.completions.create({
      model: "llama-3.1-70b-versatile",
      messages: [
        {
          role: "system",
          content: "You are RoastHub - a savage tweet generator for Indian Gen-Z. Always respond with valid JSON format only. No markdown, no code blocks, just pure JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.9,
      max_tokens: 2000,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0].message.content;
    console.log('📨 Groq AI Response received');
    console.log('Raw response:', response);
    
    // Parse the JSON response from Groq AI
    try {
      const parsedResponse = JSON.parse(response);
      
      // Check if response has a tweets array or is directly an array
      let tweets = [];
      if (Array.isArray(parsedResponse)) {
        tweets = parsedResponse;
      } else if (parsedResponse.tweets && Array.isArray(parsedResponse.tweets)) {
        tweets = parsedResponse.tweets;
      } else if (parsedResponse.data && Array.isArray(parsedResponse.data)) {
        tweets = parsedResponse.data;
      }
      
      if (tweets.length >= 10) {
        console.log('✅ Successfully generated AI tweets');
        return tweets.slice(0, 10).map(tweet => ({
          text: tweet.text || "Savage tweet here!",
          viral: tweet.viral || 7,
          relatable: tweet.relatable || 7,
          savage: tweet.savage || 7,
          brutal: tweet.brutal || 7,
          reason: tweet.reason || "Perfect desi vibe with viral potential"
        }));
      } else {
        console.log('⚠️ Received fewer than 10 tweets, using mock tweets');
        return generateMockTweets(topic);
      }
      
    } catch (parseError) {
      console.error('❌ Error parsing Groq AI response:', parseError);
      console.log('Raw response:', response);
      return generateMockTweets(topic);
    }

  } catch (error) {
    console.error('❌ Groq AI API error:', error.message);
    console.error('Full error:', error);
    
    // Provide more specific error messages
    if (error.status === 429 || error.message.includes('quota') || error.message.includes('429')) {
      console.error('⚠️ Groq API quota exceeded or rate limited. Please check your API key and quota at https://console.groq.com');
      console.error('🔄 Falling back to mock tweets. To get AI-generated tweets, please:');
      console.error('   1. Check your Groq API quota at https://console.groq.com');
      console.error('   2. Verify your GROK_API_KEY (or GROQ_API_KEY) in .env file');
      console.error('   3. Wait for quota reset or upgrade your plan');
    } else if (error.status === 401 || error.message.includes('401')) {
      console.error('⚠️ Invalid Groq API key. Please check your GROK_API_KEY (or GROQ_API_KEY) in .env file');
    } else {
      console.error('⚠️ Groq API request failed. Check your internet connection and API key.');
    }
    
    return generateMockTweets(topic);
  }
}

// Enhanced mock function as fallback
function generateMockTweets(topic) {
  console.log('🔄 Using enhanced mock tweets for topic:', topic);
  
  const templates = [
    {
      text: `Yaar ${topic} dekh ke lagta hai Indian Idol ke contestants ki acting zyada realistic hai. Slay! 🔥`,
      viral: 9, 
      relatable: 8, 
      savage: 7, 
      brutal: 8,
      reason: "Perfect desi cultural reference with reality TV roast that hits hard"
    },
    {
      text: `${topic} se better toh mere chachu ke WhatsApp forwards hain. At least unme emotion hai! 💀`,
      viral: 8, 
      relatable: 9, 
      savage: 8, 
      brutal: 7,
      reason: "Relatable Indian family WhatsApp humor with high shareability"
    },
    {
      text: `${topic} pe bolna aisa lagta hai jaise Bollywood remake ko original se compare kar rahe ho. Painful no cap! 🎬`,
      viral: 7, 
      relatable: 9, 
      savage: 8, 
      brutal: 8,
      reason: "Bollywood roast combined with current slang for maximum relatability"
    },
    {
      text: `${topic} ki situation aisi hai jaise Dhoni ne last over mein 6 maare, par opposite team ke liye. Embarrassing! 🏏`,
      viral: 8, 
      relatable: 8, 
      savage: 8, 
      brutal: 7,
      reason: "Cricket analogy that every Indian understands with perfect timing"
    },
    {
      text: `${topic} dekh ke lagta hai, SRK ne sahi kaha: "Rishte mein toh hum tumhare baap lagte hain!" Iconic! ✨`,
      viral: 9, 
      relatable: 7, 
      savage: 9, 
      brutal: 8,
      reason: "Classic Bollywood dialogue reference with savage energy"
    },
    {
      text: `${topic} ki quality dekh ke lagta hai jaise canteen ki chai - daba ke banayi hai par taste kuch khaas nahi. Basic! ☕`,
      viral: 8, 
      relatable: 9, 
      savage: 7, 
      brutal: 6,
      reason: "College canteen reference that hits home for every Indian student"
    },
    {
      text: `${topic} pe meme banane walon ki creativity dekh ke lagta hai, inko Oscar milna chahiye. So true! 🏆`,
      viral: 9, 
      relatable: 8, 
      savage: 6, 
      brutal: 5,
      reason: "Meme culture appreciation with viral potential"
    },
    {
      text: `${topic} aisa lagta hai jaise Salman Khan ki film - logic zero, entertainment full on! Bhai vibes! 💃`,
      viral: 8, 
      relatable: 9, 
      savage: 7, 
      brutal: 6,
      reason: "Salman Khan roast that every Indian cinephile will relate to"
    },
    {
      text: `${topic} ki hype aisi hai jaise India-Pakistan match ki, par result aata hai Bangladesh vs Zimbabwe jaisa. Let down! 😂`,
      viral: 9, 
      relatable: 8, 
      savage: 8, 
      brutal: 7,
      reason: "Cricket tournament analogy with perfect desi context"
    },
    {
      text: `${topic} dekh ke pata chalta hai, hum Indians ko drama pasand hai, chahe woh real life ho ya Twitter pe. Our vibe! 🎭`,
      viral: 8, 
      relatable: 9, 
      savage: 7, 
      brutal: 6,
      reason: "Meta commentary on Indian social media behavior with high relatability"
    }
  ];

  return templates;
}

export const getTweetHistory = async (req, res) => {
  try {
    const tweets = await Tweet.find().sort({ generatedAt: -1 }).limit(10);
    res.json({ 
      success: true,
      history: tweets 
    });
  } catch (error) {
    console.error('Error fetching tweet history:', error);
    res.status(500).json({ 
      error: 'Failed to fetch history',
      message: 'Could not retrieve tweet history'
    });
  }
};