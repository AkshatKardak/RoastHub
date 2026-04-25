const mongoose = require("mongoose");

const TweetSchema = new mongoose.Schema(
  {
    topic: { type: String, required: true, trim: true, index: true },
    tweets: [
      {
        text:          { type: String, required: true },
        viral:         { type: Number, min: 0, max: 100 },
        relatable:     { type: Number, min: 0, max: 100 },
        savage:        { type: Number, min: 0, max: 100 },
        brutal:        { type: Number, min: 0, max: 100 },
        humor:         { type: Number, min: 0, max: 100 },
        originality:   { type: Number, min: 0, max: 100 },
        shareability:  { type: Number, min: 0, max: 100 },
        roastScore:    { type: Number, min: 0, max: 100 },
        isEdited:      { type: Boolean, default: false },
        reactionEmoji: { type: String, default: null },
        pinned:        { type: Boolean, default: false },
        category: {
          type: String,
          enum: ["savage", "constructive", "funny", "insightful", "supportive", null],
          default: null,
        },
        tone:      { type: String },
        hashtags:  [{ type: String }],
        reason:    { type: String },
        badge:     { type: String },
        upvotes:   { type: Number, default: 0 },
        downvotes: { type: Number, default: 0 },
      },
    ],
    generatedAt: { type: Date, default: Date.now },
    searchCount:  { type: Number, default: 1 },
  },
  { timestamps: true }
);

// Compound index for trending aggregation
TweetSchema.index({ topic: 1, searchCount: -1 });
TweetSchema.index({ generatedAt: -1 });

module.exports = mongoose.model("Tweet", TweetSchema);