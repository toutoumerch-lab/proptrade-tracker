import { Router } from 'express';
import { getAlerts } from '../controllers/alerts.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();
router.use(protect);
router.get('/', getAlerts);

export default router;
