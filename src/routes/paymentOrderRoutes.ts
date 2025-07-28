// routes/paymentOrderRoutes.ts
// Rutas para manejar órdenes de pago

import { Router } from 'express';
import PaymentOrderController from '../controllers/paymentOrderController';

const router = Router();

// POST /api/payment-orders - Crear nueva orden de pago
router.post('/', PaymentOrderController.createPaymentOrder);

// GET /api/payment-orders/:orderId - Obtener orden de pago por ID
router.get('/:orderId', PaymentOrderController.getPaymentOrderById);

// GET /api/payment-orders/order/:orderNumber - Obtener orden de pago por número
router.get('/order/:orderNumber', PaymentOrderController.getPaymentOrderByNumber);

// PUT /api/payment-orders/:orderId/status - Actualizar estado de pago
router.put('/:orderId/status', PaymentOrderController.updatePaymentStatus);

// GET /api/payment-orders/user/:userId - Obtener órdenes de pago de un usuario
router.get('/user/:userId', PaymentOrderController.getUserPaymentOrders);

export default router;
