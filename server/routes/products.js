import { Router } from 'express';
import { getProduct, listPhotoCredits, listProductFilters, listProducts } from '../controllers/productController.js';

const router = Router();

router.get('/', listProducts);
router.get('/photo-credits', listPhotoCredits);
router.get('/filters', listProductFilters);
router.get('/:slug', getProduct);

export default router;
