import express from 'express';
import { generateTweets, getTweetHistory } from '../controllers/tweetController.js';

const router = express.Router();

router.post('/generate', generateTweets);
router.get('/history', getTweetHistory);

export default router;