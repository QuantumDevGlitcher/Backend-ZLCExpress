"use strict";
// routes/paymentOrderRoutes.ts
// Rutas para manejar órdenes de pago
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const paymentOrderController_1 = require("../controllers/paymentOrderController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
// 🔒 TODAS LAS RUTAS REQUIEREN AUTENTICACIÓN DE COMPRADOR
// POST /api/payment-orders - Crear nueva orden de pago
router.post('/', authMiddleware_1.requireBuyer, paymentOrderController_1.PaymentOrderController.createPaymentOrder);
// GET /api/payment-orders/order/:orderNumber - Obtener orden de pago por número
router.get('/order/:orderNumber', authMiddleware_1.requireAuth, paymentOrderController_1.PaymentOrderController.getPaymentOrderByNumber);
// GET /api/payment-orders/quote/:quoteId - Obtener orden de pago por ID de cotización
router.get('/quote/:quoteId', authMiddleware_1.requireBuyer, paymentOrderController_1.PaymentOrderController.getPaymentOrderByQuoteId);
// GET /api/payment-orders/user/:userId - Obtener órdenes de pago de un usuario
router.get('/user/:userId', authMiddleware_1.requireBuyer, paymentOrderController_1.PaymentOrderController.getUserPaymentOrders);
// PUT /api/payment-orders/:orderId/status - Actualizar estado de pago
router.put('/:orderId/status', authMiddleware_1.requireAuth, paymentOrderController_1.PaymentOrderController.updatePaymentStatus);
// GET /api/payment-orders/:orderId - Obtener orden de pago por ID
router.get('/:orderId', authMiddleware_1.requireAuth, paymentOrderController_1.PaymentOrderController.getPaymentOrderById);
exports.default = router;
