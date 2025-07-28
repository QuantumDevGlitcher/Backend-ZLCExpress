import { Router } from 'express';
import { ShippingController } from '../controllers/shippingController';

const router = Router();

// Rutas de cotizaciones de flete
router.post('/quotes', ShippingController.getShippingQuotes);
router.post('/quotes/select', ShippingController.selectShippingQuote);
router.get('/quotes/user', ShippingController.getUserQuotes);
router.get('/quotes/order/:orderId', ShippingController.getOrderQuotes);

// Rutas de puertos
router.get('/ports', ShippingController.getAvailablePorts);

// Rutas de órdenes con shipping
router.post('/orders/create', ShippingController.createOrderWithShipping);
router.post('/orders/confirm', ShippingController.confirmOrderWithShipping);

export default router;
