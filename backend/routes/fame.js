import express from 'express';
import { getWallOfFame } from '../controllers/fameController.js';

const router = express.Router();
router.get('/', getWallOfFame);
export default router;