import { Router } from 'express';
import { getAccounts, createAccount, getAccountStats } from '../controllers/accounts.controller';
import { protect } from '../middleware/auth.middleware';

const router = Router();

router.use(protect); // Protect all routes

router.route('/')
  .get(getAccounts)
  .post(createAccount);

router.get('/stats', getAccountStats);

export default router;
