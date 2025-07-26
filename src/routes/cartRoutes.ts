import { Router } from 'express';
import { CartController } from '../controllers/cartController';

const router = Router();

// Rutas del carrito
router.get('/', CartController.getCart);
router.get('/stats', CartController.getCartStats);
router.post('/add', CartController.addToCart);
router.put('/update/:itemId', CartController.updateCartItem);
router.delete('/remove/:itemId', CartController.removeFromCart);
router.delete('/clear', CartController.clearCart);

export default router;
