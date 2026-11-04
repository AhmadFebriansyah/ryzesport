import { Router } from 'express';
import { query } from '../db/pool.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    await query('SELECT 1');
    res.json({ status: 'ok', database: 'terhubung' });
  } catch (err) {
    console.error('Health check gagal:', err.message);
    res.status(503).json({ status: 'error', database: 'tidak terhubung' });
  }
});

export default router;
