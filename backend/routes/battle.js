import express from 'express';
import { roastBattle } from '../controllers/battleController.js';
import { battleLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();
router.post('/', battleLimiter, roastBattle);
export default router;