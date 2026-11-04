import { Router } from 'express';
import { listVariants } from '../controllers/variantController.js';

const router = Router();

router.get('/', listVariants);

export default router;
