import { Router } from 'express';
import { getTrades, createTrade, getTradeById, bulkCreateTrades } from '../controllers/trades.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect); // Protect all routes

router.route('/')
  .get(getTrades)
  .post(createTrade);

router.post('/bulk', bulkCreateTrades);

router.get('/:id', getTradeById);

export default router;
