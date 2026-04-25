import mongoose from 'mongoose';

const tweetSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    trim: true
  },
  tweets: [{
    text:         { type: String, required: true },
    viral:        { type: Number, required: true, min: 1, max: 10 },
    relatable:    { type: Number, required: true, min: 1, max: 10 },
    savage:       { type: Number, required: true, min: 1, max: 10 },
    brutal:       { type: Number, required: true, min: 1, max: 10 },
    humor:        { type: Number, required: true, min: 1, max: 10 },
    originality:  { type: Number, required: true, min: 1, max: 10 },
    shareability: { type: Number, required: true, min: 1, max: 10 },
    tone: {
      type: String,
      enum: ['sarcastic', 'dark', 'ironic', 'playful', 'deadpan'],
      default: 'sarcastic'
    },
    hashtags: { type: [String], default: [] },
    reason:   { type: String, required: true }
  }],
  generatedAt: {
    type: Date,
    default: Date.now
  }
});

tweetSchema.index({ generatedAt: -1 });

export default mongoose.model('Tweet', tweetSchema);