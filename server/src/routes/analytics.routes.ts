import { Router } from 'express';
import { getAnalyticsSummary, getEquityCurve } from '../controllers/analytics.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect); // Protect all routes

router.get('/summary', getAnalyticsSummary);
router.get('/equity-curve', getEquityCurve);

export default router;
