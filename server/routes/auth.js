import { Router } from 'express';
import { rateLimit } from 'express-rate-limit';
import { login, me, register } from '../controllers/authController.js';
import { requireAuth } from '../middleware/auth.js';

const router = Router();

// Memperlambat tebak password dan pembuatan akun massal.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  limit: 20,
  standardHeaders: 'draft-7',
  legacyHeaders: false,
  message: { message: 'Terlalu banyak percobaan. Coba lagi nanti.' },
});

router.post('/register', authLimiter, register);
router.post('/login', authLimiter, login);
router.get('/me', requireAuth, me);

export default router;
