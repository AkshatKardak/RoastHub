import Tweet from '../models/Tweet.js';
import OpenAI from 'openai';
import dotenv from 'dotenv';

dotenv.config();

let groqClient;
try {
  groqClient = new OpenAI({
    apiKey: process.env.GROQ_API_KEY,
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
        message: 'Please provide a topic to generate tweets about'
      });
    }

    const tweets = await generateAITweets(topic.trim());

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
  if (!groqClient || !process.env.GROQ_API_KEY) {
    console.log('🔄 Using mock tweets (Groq AI not configured)');
    return generateMockTweets(topic);
  }

  try {
    console.log('🤖 Generating AI tweets with Groq for topic:', topic);

    const prompt = `You are RoastHub, an AI specialized in creating savage, brutal, no-hesitation, ultra-relatable tweets for a global audience.

Generate exactly 10 viral-potential tweets on this topic: "${topic}"

Requirements:
- Each tweet must be 1-2 lines maximum
- Use Gen-Z slang, internet culture, and trending global phrases
- Reference relevant pop culture, sports, movies, tech, or current world events based on the topic
- Be savage and brutally honest but avoid hate speech or discrimination
- Each tweet should be different in format and style (some with emojis, some without, some questions, some statements)
- Use current internet slang (rizz, slay, no cap, vibe, based, mid, lowkey, NPC, touch grass, rent free, etc.)
- Make it universally understandable while still being culturally sharp

For each tweet, provide these ratings out of 10:
- Viral Potential: How likely to go viral on X/Twitter globally
- Relatability: How much people worldwide will connect with it
- Savage Level: How brutally honest/roasting it is
- Brutal Factor: How hard-hitting the truth is
- Humor Level: How funny/witty it actually is
- Originality: How fresh and unique the angle is (not a recycled joke)
- Shareability: How likely someone shares it on WhatsApp, Instagram, LinkedIn

Also provide:
- tone: one of "sarcastic", "dark", "ironic", "playful", "deadpan"
- hashtags: array of 2-3 relevant trending hashtags for the tweet

Return ONLY a valid JSON object:
{
  "tweets": [
    {
      "text": "the actual tweet text",
      "viral": number,
      "relatable": number,
      "savage": number,
      "brutal": number,
      "humor": number,
      "originality": number,
      "shareability": number,
      "tone": "sarcastic|dark|ironic|playful|deadpan",
      "hashtags": ["#Tag1", "#Tag2"],
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
          content: "You are RoastHub - a savage tweet generator for global Gen-Z. Always respond with valid JSON format only. No markdown, no code blocks, just pure JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.9,
      max_tokens: 2500,
      response_format: { type: "json_object" }
    });

    const response = completion.choices[0].message.content;
    console.log('📨 Groq AI Response received');

    try {
      const parsedResponse = JSON.parse(response);

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
          text:         tweet.text         || "Savage tweet here!",
          viral:        tweet.viral        || 7,
          relatable:    tweet.relatable    || 7,
          savage:       tweet.savage       || 7,
          brutal:       tweet.brutal       || 7,
          humor:        tweet.humor        || 7,
          originality:  tweet.originality  || 7,
          shareability: tweet.shareability || 7,
          tone:         tweet.tone         || "sarcastic",
          hashtags:     Array.isArray(tweet.hashtags) ? tweet.hashtags : [],
          reason:       tweet.reason       || "Perfect vibe with viral potential"
        }));
      } else {
        console.log('⚠️ Received fewer than 10 tweets, using mock tweets');
        return generateMockTweets(topic);
      }

    } catch (parseError) {
      console.error('❌ Error parsing Groq AI response:', parseError);
      return generateMockTweets(topic);
    }

  } catch (error) {
    console.error('❌ Groq AI API error:', error.message);

    if (error.status === 429 || error.message.includes('quota') || error.message.includes('429')) {
      console.error('⚠️ Groq API quota exceeded or rate limited.');
    } else if (error.status === 401 || error.message.includes('401')) {
      console.error('⚠️ Invalid Groq API key.');
    }

    return generateMockTweets(topic);
  }
}

function generateMockTweets(topic) {
  console.log('🔄 Using enhanced mock tweets for topic:', topic);

  const templates = [
    {
      text: `${topic} really said "hold my beer" and then spilled it on everyone. Unhinged behavior 🍺`,
      viral: 9, relatable: 8, savage: 7, brutal: 8, humor: 9, originality: 8, shareability: 9,
      tone: "sarcastic", hashtags: [`#${topic.replace(/\s+/g,'').slice(0,15)}`, "#NoContext", "#ViralTweet"],
      reason: "Universal chaos energy reference with high shareability"
    },
    {
      text: `The way ${topic} has a worse arc than a season 8 Game of Thrones character 💀`,
      viral: 8, relatable: 9, savage: 8, brutal: 7, humor: 8, originality: 7, shareability: 8,
      tone: "dark", hashtags: [`#${topic.replace(/\s+/g,'').slice(0,15)}`, "#RIPThisNarrative"],
      reason: "Iconic pop culture comparison that hits home globally"
    },
    {
      text: `${topic} is just NPC behavior at this point. No cap, zero rizz, fully cooked 💅`,
      viral: 8, relatable: 8, savage: 9, brutal: 8, humor: 8, originality: 8, shareability: 7,
      tone: "sarcastic", hashtags: [`#${topic.replace(/\s+/g,'').slice(0,15)}`, "#GenZ", "#NPC"],
      reason: "Gen-Z slang overload that resonates with young audiences worldwide"
    },
    {
      text: `Bro ${topic} got the audacity to exist and still be mid. Respect the confidence honestly 🫡`,
      viral: 9, relatable: 8, savage: 8, brutal: 7, humor: 9, originality: 9, shareability: 9,
      tone: "ironic", hashtags: [`#${topic.replace(/\s+/g,'').slice(0,15)}`, "#BackhandedCompliment"],
      reason: "Backhanded compliment format that always goes viral"
    },
    {
      text: `${topic} really lives rent free in people's heads like they own a penthouse there 🏙️`,
      viral: 8, relatable: 9, savage: 7, brutal: 6, humor: 8, originality: 8, shareability: 8,
      tone: "playful", hashtags: [`#${topic.replace(/\s+/g,'').slice(0,15)}`, "#LivingRentFree"],
      reason: "Relatable 'rent free' internet phrase applied perfectly"
    },
    {
      text: `${topic} dropped like it was supposed to change lives. My life remains unchanged. 😐`,
      viral: 7, relatable: 9, savage: 8, brutal: 9, humor: 8, originality: 7, shareability: 8,
      tone: "deadpan", hashtags: [`#${topic.replace(/\s+/g,'').slice(0,15)}`, "#Disappointed"],
      reason: "Deadpan disappointment that everyone feels but few say"
    },
    {
      text: `Scientists discovered that ${topic} and wasted potential share 99% of the same DNA 🧬`,
      viral: 9, relatable: 8, savage: 9, brutal: 9, humor: 9, originality: 9, shareability: 8,
      tone: "dark", hashtags: [`#${topic.replace(/\s+/g,'').slice(0,15)}`, "#Science", "#RoastHub"],
      reason: "Fake science format with brutal punchline always goes viral"
    },
    {
      text: `${topic} energy is just telling your therapist you're fine and then crying in the parking lot 🚗💧`,
      viral: 9, relatable: 9, savage: 8, brutal: 8, humor: 8, originality: 8, shareability: 9,
      tone: "dark", hashtags: [`#${topic.replace(/\s+/g,'').slice(0,15)}`, "#MentalHealth", "#Relatable"],
      reason: "Therapy/parking lot crying is the most universally relatable modern experience"
    },
    {
      text: `${topic} said "main character energy" but forgot main characters actually have a plot 🎬`,
      viral: 8, relatable: 9, savage: 8, brutal: 7, humor: 9, originality: 8, shareability: 8,
      tone: "ironic", hashtags: [`#${topic.replace(/\s+/g,'').slice(0,15)}`, "#MainCharacter"],
      reason: "Main character trope subversion that hits perfectly"
    },
    {
      text: `At this point ${topic} is just a cautionary tale we tell at bedtime. Sleep tight bestie 👋`,
      viral: 8, relatable: 8, savage: 9, brutal: 8, humor: 8, originality: 8, shareability: 7,
      tone: "sarcastic", hashtags: [`#${topic.replace(/\s+/g,'').slice(0,15)}`, "#CautionaryTale"],
      reason: "Dismissive goodbye format is extremely shareable as a reaction tweet"
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