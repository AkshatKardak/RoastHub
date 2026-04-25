import Tweet from '../models/Tweet.js';

export const getWallOfFame = async (req, res, next) => {
  try {
    const { range = 'alltime' } = req.query;
    const limit = Math.min(parseInt(req.query.limit) || 12, 50);

    let dateFilter = {};
    if (range === 'week') dateFilter = { generatedAt: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) } };
    else if (range === 'today') dateFilter = { generatedAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } };

    const results = await Tweet.aggregate([
      { $match: dateFilter },
      { $unwind: '$tweets' },
      { $match: { 'tweets.roastScore': { $exists: true, $gte: 0 } } },
      { $project: { topic: 1, text: '$tweets.text', roastScore: '$tweets.roastScore', viral: '$tweets.viral', savage: '$tweets.savage', humor: '$tweets.humor', badge: '$tweets.badge', tone: '$tweets.tone', hashtags: '$tweets.hashtags', category: '$tweets.category', reactionEmoji: '$tweets.reactionEmoji', upvotes: '$tweets.upvotes', generatedAt: 1 } },
      { $sort: { roastScore: -1, upvotes: -1 } },
      { $limit: limit },
    ]);
    res.json({ tweets: results, range });
  } catch (err) {
    next(err);
  }
};