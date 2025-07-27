"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const orderPrismaController_1 = require("../controllers/orderPrismaController");
const router = (0, express_1.Router)();
// ===== RUTAS DE ÓRDENES CON PRISMA =====
// GET /api/orders - Obtener todas las órdenes con filtros
router.get('/', orderPrismaController_1.getOrders);
// GET /api/orders/user/:userId - Obtener órdenes de un usuario específico
router.get('/user/:userId', orderPrismaController_1.getOrdersByUser);
// GET /api/orders/:id - Obtener orden por ID
router.get('/:id', orderPrismaController_1.getOrderById);
// POST /api/orders - Crear nueva orden
router.post('/', orderPrismaController_1.createOrder);
// PUT /api/orders/:id/status - Actualizar estado de orden
router.put('/:id/status', orderPrismaController_1.updateOrderStatus);
// PUT /api/orders/:id/cancel - Cancelar orden
router.put('/:id/cancel', orderPrismaController_1.cancelOrder);
exports.default = router;
