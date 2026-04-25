const Tweet = require("../models/Tweet");

const getTrending = async (req, res, next) => {
  try {
    const limit = Math.min(parseInt(req.query.limit) || 10, 20);

    // Aggregate: group by topic, sum searchCount, sort by most searched in last 24h
    const since = new Date(Date.now() - 24 * 60 * 60 * 1000);

    const trending = await Tweet.aggregate([
      { $match: { generatedAt: { $gte: since } } },
      {
        $group: {
          _id: { $toLower: "$topic" },
          topic: { $first: "$topic" },
          totalSearches: { $sum: "$searchCount" },
          lastSeen: { $max: "$generatedAt" },
        },
      },
      { $sort: { totalSearches: -1 } },
      { $limit: limit },
      {
        $project: {
          _id: 0,
          topic: 1,
          count: "$totalSearches",
          lastSeen: 1,
        },
      },
    ]);

    // Fallback: if nothing in 24h, get all-time top
    if (trending.length === 0) {
      const allTime = await Tweet.aggregate([
        {
          $group: {
            _id: { $toLower: "$topic" },
            topic: { $first: "$topic" },
            totalSearches: { $sum: "$searchCount" },
          },
        },
        { $sort: { totalSearches: -1 } },
        { $limit: limit },
        { $project: { _id: 0, topic: 1, count: "$totalSearches" } },
      ]);
      return res.json({ trending: allTime, period: "alltime" });
    }

    res.json({ trending, period: "24h" });
  } catch (err) {
    next(err);
  }
};

module.exports = { getTrending };