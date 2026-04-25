import express from 'express';
import { generateTweets } from '../controllers/tweetController.js';
import { generateLimiter } from '../middleware/rateLimiter.js';
import validateTopic from '../middleware/validateTopic.js';

const router = express.Router();
router.post('/generate', generateLimiter, validateTopic, generateTweets);
export default router;