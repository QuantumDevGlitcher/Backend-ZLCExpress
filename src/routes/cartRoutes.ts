import { Router } from 'express';
import { CartController } from '../controllers/cartController';
import { requireAuth, requireBuyer } from '../middleware/authMiddleware';

const router = Router();

// 🔒 TODAS LAS RUTAS DEL CARRITO REQUIEREN AUTENTICACIÓN DE COMPRADOR
router.get('/', requireBuyer, CartController.getCart);
router.get('/stats', requireBuyer, CartController.getCartStats);
router.post('/add', requireBuyer, CartController.addToCart);
router.put('/update/:itemId', requireBuyer, CartController.updateCartItem);
router.delete('/remove/:itemId', requireBuyer, CartController.removeFromCart);
router.delete('/clear', requireBuyer, CartController.clearCart);

export default router;
