import { Router } from 'express';
import { getAllProducts, getProductById, getProductsByCategory } from '../controllers/productController';

const router = Router();

// Rutas de productos
router.get('/', getAllProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);

export default router;
