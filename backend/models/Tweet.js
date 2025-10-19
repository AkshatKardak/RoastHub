import mongoose from 'mongoose';

const tweetSchema = new mongoose.Schema({
  topic: {
    type: String,
    required: true,
    trim: true
  },
  tweets: [{
    text: {
      type: String,
      required: true
    },
    viral: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    relatable: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    savage: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    brutal: {
      type: Number,
      required: true,
      min: 1,
      max: 10
    },
    reason: {
      type: String,
      required: true
    }
  }],
  generatedAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for faster queries
tweetSchema.index({ generatedAt: -1 });

export default mongoose.model('Tweet', tweetSchema);