import express from 'express';
import { translateRoast } from '../controllers/translateController.js';

const router = express.Router();
router.post('/', translateRoast);
export default router;