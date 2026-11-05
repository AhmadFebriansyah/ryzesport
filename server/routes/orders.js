import { Router } from 'express';
import { createOrder } from '../controllers/orderController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

router.use(requireAuth);
router.post('/', createOrder);

export default router;
